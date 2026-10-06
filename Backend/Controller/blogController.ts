import { Request, Response } from "express";
import Blog from "../Model/blogModel.js";
import User from "../Model/userModel.js";
import Notification from "../Model/notificationModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// CREATE BLOG
export const createBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content, videoId } = req.body;

    let imageUrl = "";

    if (req.file) {
      const file = req.file;

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dashboard-blogs",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(file.buffer)
          .pipe(uploadStream);
      });

      imageUrl = result.secure_url;
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user.id,
      image: imageUrl,
      videoId: videoId || undefined,
    });

    // Notify all teachers and admins about the new blog
    try {
      const recipients = await User.find(
        { role: { $in: ["teacher", "admin"] } },
        "_id"
      );

      if (recipients.length > 0) {
        await Notification.insertMany(
          recipients.map((r) => ({
            recipient: r._id,
            sender: req.user.id,
            type: "new_blog",
            blog: blog._id,
          }))
        );
      }
    } catch (notifErr) {
      console.log("NEW_BLOG NOTIFICATION ERROR:", notifErr);
    }

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.log("CREATE BLOG ERROR:", error);

    res.status(500).json({
      message: "Failed to create blog",
    });
  }
};


// GET ALL BLOGS
export const getBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await Blog.find({ status: "approved" })
      .populate("author", "name email")
      .populate("videoId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      blogs,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
};


// GET BLOG BY ID
export const getBlogById = async (
  req: Request,
  res: Response
) => {
  try {
   const blog = await Blog.findById(req.params.id)
  .populate("author", "name email role")
  .populate("videoId")
  .populate("comments.author", "name")
  .populate("reviewedBy", "name")
  .populate("comments.replies.author", "name role")
  .populate("comments.replies.replies.author", "name role");

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const isAuthor =
      blog.author._id.toString() === req.user.id;

    const isTeacherOrAdmin =
      req.user.role === "teacher" ||
      req.user.role === "admin";

    if (
      blog.status !== "approved" &&
      !isAuthor &&
      !isTeacherOrAdmin
    ) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.status(200).json({
      blog,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get blog",
    });
  }
};


// GET MY BLOGS
export const getMyBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      blogs,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your blogs",
    });
  }
};


// UPDATE MY BLOG
export const updateBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content, videoId } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own blog",
      });
    }

    const wasRejected = blog.status === "rejected";

    blog.title = title;
    blog.content = content;

    if (videoId) {
      blog.videoId = videoId;
    }

    // Resubmit: rejected → pending
    if (wasRejected) {
      blog.status = "pending";
      blog.rejectionReason = undefined;
      blog.reviewedBy = undefined;
      blog.reviewedAt = undefined;
    }

    if (req.file) {
      const file = req.file;

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dashboard-blogs",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier
          .createReadStream(file.buffer)
          .pipe(uploadStream);
      });

      blog.image = result.secure_url;
    }

    await blog.save();

    // If resubmitted, notify teachers/admins again
    if (wasRejected) {
      try {
        const recipients = await User.find(
          { role: { $in: ["teacher", "admin"] } },
          "_id"
        );

        if (recipients.length > 0) {
          await Notification.insertMany(
            recipients.map((r) => ({
              recipient: r._id,
              sender: req.user.id,
              type: "new_blog",
              blog: blog._id,
            }))
          );
        }
      } catch (notifErr) {
        console.log("RESUBMIT NOTIFICATION ERROR:", notifErr);
      }
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });

  } catch (error) {
    console.log("UPDATE BLOG ERROR:", error);

    res.status(500).json({
      message: "Failed to update blog",
    });
  }
};


// TOGGLE BLOG LIKE
export const toggleLike = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Make sure old blogs also have likes array
    if (!blog.likes) {
      blog.likes = [];
    }

    const userId = req.user.id;

    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      blog.likes.push(userId as any);
    }

    await blog.save();

    // Notification
    try {
      const authorId = blog.author.toString();

      // Never notify yourself
      if (authorId !== userId) {
        if (!alreadyLiked) {
          await Notification.create({
            recipient: authorId,
            sender: userId,
            type: "like",
            blog: blog._id,
          });
        } else {
          await Notification.deleteOne({
            recipient: authorId,
            sender: userId,
            type: "like",
            blog: blog._id,
          });
        }
      }
    } catch (notifErr) {
      console.log("LIKE NOTIFICATION ERROR:", notifErr);
    }

    res.status(200).json({
      liked: !alreadyLiked,
      likeCount: blog.likes.length,
    });

  } catch (error) {
    console.log("TOGGLE LIKE ERROR:", error);

    res.status(500).json({
      message: "Failed to toggle like",
    });
  }
};


// TOGGLE SAVE
export const toggleSave = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const blogId = req.params.id;

    if (!user.savedBlogs) {
      user.savedBlogs = [];
    }

    const alreadySaved = user.savedBlogs.some(
      (id) => id.toString() === blogId
    );

    if (alreadySaved) {
      user.savedBlogs = user.savedBlogs.filter(
        (id) => id.toString() !== blogId
      );
    } else {
      user.savedBlogs.push(blogId as any);
    }

    await user.save();

    res.status(200).json({
      saved: !alreadySaved,
      saveCount: user.savedBlogs.length,
    });

  } catch (error) {
    console.log("TOGGLE SAVE ERROR:", error);

    res.status(500).json({
      message: "Failed to toggle save",
    });
  }
};


// GET SAVED BLOGS
export const getSavedBlogs = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedBlogs",
      match: { status: "approved" },
      populate: {
        path: "author",
        select: "name email",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      blogs: user.savedBlogs,
    });

  } catch (error) {
    console.log("GET SAVED BLOGS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch saved blogs",
    });
  }
};


// REVIEW: GET BLOGS FOR REVIEW
export const getBlogsForReview = async (
  req: Request,
  res: Response
) => {
  try {
    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
    ] as const;

    type BlogStatus = (typeof allowedStatuses)[number];

    const rawStatus = String(
      req.query.status || "pending"
    );

    const status: BlogStatus =
      (allowedStatuses as readonly string[]).includes(rawStatus)
        ? (rawStatus as BlogStatus)
        : "pending";

    const blogs = await Blog.find({ status })
      .populate("author", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    const [pending, approved, rejected] =
      await Promise.all([
        Blog.countDocuments({ status: "pending" }),
        Blog.countDocuments({ status: "approved" }),
        Blog.countDocuments({ status: "rejected" }),
      ]);

    res.status(200).json({
      blogs,
      counts: {
        pending,
        approved,
        rejected,
      },
    });

  } catch (error) {
    console.log("GET BLOGS FOR REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch blogs for review",
    });
  }
};


// REVIEW: APPROVE BLOG
export const approveBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const isAdmin = req.user.role === "admin";

    // Atomic first-reviewer-wins
    const pendingBlog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        status: "approved",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        $unset: {
          rejectionReason: "",
        },
      },
      {
        new: true,
      }
    ).populate("reviewedBy", "name");

    if (pendingBlog) {
      try {
        await Notification.create({
          recipient: pendingBlog.author,
          sender: req.user.id,
          type: "blog_approved",
          blog: pendingBlog._id,
        });
      } catch (notifErr) {
        console.log(
          "APPROVE NOTIFICATION ERROR:",
          notifErr
        );
      }

      return res.status(200).json({
        message: "Blog approved",
        blog: pendingBlog,
      });
    }

    const exists = await Blog.findById(
      req.params.id
    ).populate("reviewedBy", "name");

    if (!exists) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (exists.status === "approved") {
      return res.status(409).json({
        message: `Already reviewed by ${
          (exists.reviewedBy as any)?.name ||
          "another reviewer"
        }`,
        reviewedBy: (exists.reviewedBy as any)?.name,
        currentStatus: exists.status,
      });
    }

    if (
      !isAdmin &&
      exists.reviewedBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only change your own decision",
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        $unset: {
          rejectionReason: "",
        },
      },
      {
        new: true,
      }
    ).populate("reviewedBy", "name");

    try {
      await Notification.deleteMany({
        blog: blog!._id,
        type: {
          $in: [
            "blog_approved",
            "blog_rejected",
          ],
        },
      });

      await Notification.create({
        recipient: blog!.author,
        sender: req.user.id,
        type: "blog_approved",
        blog: blog!._id,
      });

    } catch (notifErr) {
      console.log(
        "APPROVE CHANGE NOTIFICATION ERROR:",
        notifErr
      );
    }

    res.status(200).json({
      message: "Blog approved",
      blog,
    });

  } catch (error) {
    console.log("APPROVE BLOG ERROR:", error);

    res.status(500).json({
      message: "Failed to approve blog",
    });
  }
};


// REVIEW: REJECT BLOG
export const rejectBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const { reason } = req.body;

    if (
      !reason ||
      reason.trim().length < 5 ||
      reason.trim().length > 300
    ) {
      return res.status(400).json({
        message:
          "Rejection reason must be between 5 and 300 characters",
      });
    }

    const isAdmin = req.user.role === "admin";
    const trimmed = reason.trim();

    // Atomic first-reviewer-wins
    const pendingBlog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
      },
      {
        status: "rejected",
        rejectionReason: trimmed,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      {
        new: true,
      }
    ).populate("reviewedBy", "name");

    if (pendingBlog) {
      try {
        await Notification.create({
          recipient: pendingBlog.author,
          sender: req.user.id,
          type: "blog_rejected",
          blog: pendingBlog._id,
          commentText: trimmed.slice(0, 100),
        });
      } catch (notifErr) {
        console.log(
          "REJECT NOTIFICATION ERROR:",
          notifErr
        );
      }

      return res.status(200).json({
        message: "Blog rejected",
        blog: pendingBlog,
      });
    }

    const exists = await Blog.findById(
      req.params.id
    ).populate("reviewedBy", "name");

    if (!exists) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    if (exists.status === "rejected") {
      return res.status(409).json({
        message: `Already reviewed by ${
          (exists.reviewedBy as any)?.name ||
          "another reviewer"
        }`,
        reviewedBy: (exists.reviewedBy as any)?.name,
        currentStatus: exists.status,
      });
    }

    if (
      !isAdmin &&
      exists.reviewedBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only change your own decision",
      });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: trimmed,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      {
        new: true,
      }
    ).populate("reviewedBy", "name");

    try {
      await Notification.deleteMany({
        blog: blog!._id,
        type: {
          $in: [
            "blog_approved",
            "blog_rejected",
          ],
        },
      });

      await Notification.create({
        recipient: blog!.author,
        sender: req.user.id,
        type: "blog_rejected",
        blog: blog!._id,
        commentText: trimmed.slice(0, 100),
      });

    } catch (notifErr) {
      console.log(
        "REJECT CHANGE NOTIFICATION ERROR:",
        notifErr
      );
    }

    res.status(200).json({
      message: "Blog rejected",
      blog,
    });

  } catch (error) {
    console.log("REJECT BLOG ERROR:", error);

    res.status(500).json({
      message: "Failed to reject blog",
    });
  }
};


// ADD COMMENT
export const addComment = async (
  req: Request,
  res: Response
) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // Always create complete comment structure
    blog.comments.push({
      text: text.trim(),
      author: req.user.id as any,
      likes: [],
      replies: [],
    });

    await blog.save();

    await blog.populate(
      "comments.author",
      "name role"
    );

    const newComment =
      blog.comments[blog.comments.length - 1];

    // Notify blog author
    try {
      const authorId = blog.author.toString();

      if (authorId !== req.user.id) {
        await Notification.create({
          recipient: authorId,
          sender: req.user.id,
          type: "comment",
          blog: blog._id,
          commentText: text
            .trim()
            .slice(0, 100),
        });
      }
    } catch (notifErr) {
      console.log(
        "COMMENT NOTIFICATION ERROR:",
        notifErr
      );
    }

    res.status(201).json({
      comment: newComment,
      commentCount: blog.comments.length,
    });

  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};


// DELETE COMMENT
export const deleteComment = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comment = blog.comments.find(
      (c) =>
        c._id?.toString() ===
        req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const isOwner =
      comment.author.toString() === req.user.id;

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          "You can only delete your own comment",
      });
    }

    blog.comments = blog.comments.filter(
      (c) =>
        c._id?.toString() !==
        req.params.commentId
    );

    await blog.save();

    res.status(200).json({
      message: "Comment deleted",
      commentCount: blog.comments.length,
    });

  } catch (error) {
    console.log("DELETE COMMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};


// DELETE MY BLOG
export const deleteBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const isAdmin =
      req.user.role === "admin";

    const isOwner =
      blog.author.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message:
          "You can only delete your own blog",
      });
    }

    const reason = req.body?.reason;

    await Blog.findByIdAndDelete(
      req.params.id
    );

    // Tell author when admin removes blog
    if (isAdmin && !isOwner) {
      try {
        await Notification.create({
          recipient: blog.author,
          sender: req.user.id,
          type: "blog_removed",
          blogTitle: blog.title,
          commentText: reason
            ? String(reason)
                .trim()
                .slice(0, 200)
            : undefined,
        });
      } catch (error) {
        console.log(
          "REMOVED NOTIFICATION ERROR:",
          error
        );
      }
    }

    res.status(200).json({
      message: "Blog deleted successfully",
    });

  } catch (error) {
    console.log("DELETE BLOG ERROR:", error);

    res.status(500).json({
      message: "Failed to delete blog",
    });
  }
};






// FIND COMMENT HELPER
const findComment = (
  blog: any,
  commentId: string | string[]
) => {
  return blog.comments.find(
    (c: any) =>
      c._id?.toString() === String(commentId)
  );
};

// TOGGLE COMMENT LIKE
export const toggleCommentLike = async (req: Request, res: Response) => {
  try {
    console.log("=== COMMENT LIKE START ===");
    console.log("BLOG ID:", req.params.id);
    console.log("COMMENT ID:", req.params.commentId);
    console.log("USER:", req.user);

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.find(
      (c: any) => c._id?.toString() === String(req.params.commentId)
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Make sure likes exists
    if (!comment.likes) {
      comment.likes = [];
    }

    const userId = req.user.id;

    const index = comment.likes.findIndex(
      (like: any) => like.toString() === userId
    );

    if (index === -1) {
      comment.likes.push(userId as any);
    } else {
      comment.likes.splice(index, 1);
    }

    await blog.save();

    console.log("COMMENT LIKE SUCCESS");

    return res.status(200).json({
      liked: index === -1,
      likeCount: comment.likes.length,
       likes: comment.likes,   
    });
  } catch (error: any) {
    console.log("=== COMMENT LIKE ERROR ===");
    console.log(error);
    console.log("ERROR MESSAGE:", error?.message);
    console.log("ERROR NAME:", error?.name);

    return res.status(500).json({
      message: "Failed to update like",
      error: error?.message,
    });
  }
};

// TOGGLE REPLY LIKE
// ============================================
// TOGGLE REPLY LIKE
//
// Works for:
// Comment → Reply 
// Comment → Reply → Nested Reply 
// ============================================

export const toggleReplyLike = async (
  req: Request,
  res: Response
) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    const comment = findComment(
      blog,
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!comment.replies) {
      comment.replies = [];
    }

    const replyId = String(req.params.replyId);
    const userId = req.user.id;

    // 1. First check normal/top-level reply
    const reply = comment.replies.find(
      (r: any) =>
        r._id?.toString() === replyId
    );

    if (reply) {
      if (!reply.likes) {
        reply.likes = [];
      }

      const index = reply.likes.findIndex(
        (id: any) =>
          id.toString() === userId
      );

      if (index === -1) {
        reply.likes.push(userId as any);
      } else {
        reply.likes.splice(index, 1);
      }

      await blog.save();

      return res.status(200).json({
        liked: index === -1,
        likeCount: reply.likes.length,
        likes: reply.likes,
      });
    }

    // 2. If not found, search nested reply
    for (const parentReply of comment.replies as any[]) {
      if (!parentReply.replies) continue;

      const nestedReply = parentReply.replies.find(
        (nested: any) =>
          nested._id?.toString() === replyId
      );

      if (nestedReply) {
        if (!nestedReply.likes) {
          nestedReply.likes = [];
        }

        const index = nestedReply.likes.findIndex(
          (id: any) =>
            id.toString() === userId
        );

        if (index === -1) {
          nestedReply.likes.push(userId as any);
        } else {
          nestedReply.likes.splice(index, 1);
        }

        await blog.save();

        return res.status(200).json({
          liked: index === -1,
          likeCount: nestedReply.likes.length,
          likes: nestedReply.likes,
        });
      }
    }

    return res.status(404).json({
      message: "Reply not found",
    });

  } catch (error) {
    console.log("REPLY LIKE ERROR:", error);

    return res.status(500).json({
      message: "Failed to update reply like",
    });
  }
};


// ADD REPLY
// ============================================
// ADD REPLY
// Supports:
// Comment → Reply
// Comment → Reply → Nested Reply
// Maximum 2 reply levels
// ============================================


export const addReply = async (req: Request, res: Response) => {
  try {
    // If you do NOT see this line in the terminal when you reply,
    // the request is not reaching this function (old build / other server / other route).
    console.log("NEW addReply HIT:", {
      blogId: req.params.id,
      commentId: req.params.commentId,
      body: req.body,
    });
 
    const text = String(req.body.text || "").trim();
    const { replyId } = req.body;
 
    if (!text || text.length > 500) {
      return res.status(400).json({
        message: "Reply must be 1 to 500 characters",
      });
    }
 
    const blog = await Blog.findById(req.params.id);
 
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
 
    const comment = findComment(blog, req.params.commentId);
 
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
 
    if (!comment.replies) {
      comment.replies = [];
    }
 
    if (!replyId) {
      // CASE 1: reply directly to the comment
      console.log("addReply -> CASE 1 (reply to comment)");
 
      comment.replies.push({
        author: req.user.id as any,
        text,
        likes: [],
        replies: [],
      });
    } else {
      // CASE 2: reply to an existing reply (nested)
      console.log("addReply -> CASE 2 (reply to reply)", replyId);
 
      const parentReply = comment.replies.find(
        (reply: any) => reply._id?.toString() === String(replyId)
      );
 
      if (!parentReply) {
        return res.status(404).json({ message: "Reply not found" });
      }
 
      if (!parentReply.replies) {
        parentReply.replies = [];
      }
 
      parentReply.replies.push({
        author: req.user.id as any,
        text,
        likes: [],
      });
    }
 
    await blog.save();
 
    await blog.populate([
      { path: "comments.author", select: "name role" },
      { path: "comments.replies.author", select: "name role" },
      { path: "comments.replies.replies.author", select: "name role" },
    ]);
 
    const updatedComment = findComment(blog, req.params.commentId);
 
    return res.status(201).json({
      comment: updatedComment,
    });
  } catch (error) {
    console.log("ADD REPLY ERROR:", error);
 
    return res.status(500).json({
      message: "Failed to post reply",
    });
  }
};
 


// DELETE REPLY
// ============================================
// DELETE REPLY
//
// Can delete:
// 1. Normal Reply
// 2. Nested Reply
// ============================================

export const deleteReply = async (
  req: Request,
  res: Response
) => {
  try {

    // -----------------------------------------
    // Find blog
    // -----------------------------------------

    const blog = await Blog.findById(
      req.params.id
    );

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    // -----------------------------------------
    // Find comment
    // -----------------------------------------

    const comment = findComment(
      blog,
      req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (!comment.replies) {
      comment.replies = [];
    }

    const replyId = String(
      req.params.replyId
    );


    // =========================================
    // CASE 1:
    // Delete normal reply
    // =========================================

    const parentReplyIndex =
      comment.replies.findIndex(
        (reply: any) =>
          reply._id?.toString() === replyId
      );


    if (parentReplyIndex !== -1) {

      const reply =
        comment.replies[parentReplyIndex];

      const isOwner =
        reply.author?.toString() ===
        req.user.id;

      const isAdmin =
        req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          message:
            "You can only delete your own reply",
        });
      }

      // Delete parent reply
      // Its nested replies also disappear
      comment.replies.splice(
        parentReplyIndex,
        1
      );

      await blog.save();

      return res.status(200).json({
        message: "Reply deleted",
      });
    }


    // =========================================
    // CASE 2:
    // Delete nested reply
    // =========================================

    for (
      const parentReply of comment.replies
    ) {

      if (!parentReply.replies) {
        continue;
      }

      const nestedReplyIndex =
        parentReply.replies.findIndex(
          (nested: any) =>
            nested._id?.toString() === replyId
        );


      if (nestedReplyIndex !== -1) {

        const nestedReply =
          parentReply.replies[
            nestedReplyIndex
          ];

        const isOwner =
          nestedReply.author?.toString() ===
          req.user.id;

        const isAdmin =
          req.user.role === "admin";


        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            message:
              "You can only delete your own reply",
          });
        }


        // Delete nested reply

        parentReply.replies.splice(
          nestedReplyIndex,
          1
        );

        await blog.save();

        return res.status(200).json({
          message: "Reply deleted",
        });
      }
    }


    // -----------------------------------------
    // Reply not found
    // -----------------------------------------

    return res.status(404).json({
      message: "Reply not found",
    });

  } catch (error) {

    console.log(
      "DELETE REPLY ERROR:",
      error
    );

    return res.status(500).json({
      message: "Failed to delete reply",
    });
  }
};