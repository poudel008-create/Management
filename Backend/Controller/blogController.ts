import { Request, Response } from "express";
import Blog from "../Model/blogModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// CREATE BLOG
export const createBlog = async (
  req: Request,
  res: Response
) => {
  try {
    const { title, content } = req.body;

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
    });

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
    const blogs = await Blog.find()
      .populate("author", "name email")
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

export const getBlogById = async (
  req:Request,
   res:Response
  ) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email role");

    if (!blog) {
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
    const { title, content } = req.body;

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

    blog.title = title;
    blog.content = content;

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

    // Check ownership
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own blog",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

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