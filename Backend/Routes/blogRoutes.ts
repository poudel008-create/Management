import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import upload from "../middleware/upload.js";

import {
  createBlog,
  getBlogs,
  getMyBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
  toggleSave,
  getSavedBlogs,
  getBlogsForReview,
  approveBlog,
  rejectBlog,
  addReply,
  deleteReply,
  toggleCommentLike,
  toggleReplyLike,
} from "../Controller/blogController.js";

const router = express.Router();


// View all blogs
router.get(
  "/",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  getBlogs
);



// View my blogs
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("student"),
  getMyBlogs
);




// Get saved blogs  ← before /:id
router.get(
  "/saved",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  getSavedBlogs
);


// Review queue  ← before /:id
router.get(
  "/review",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  getBlogsForReview
);


// Approve  ← before /:id
router.patch(
  "/:id/approve",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  approveBlog
);


// Reject  ← before /:id
router.patch(
  "/:id/reject",
  authMiddleware,
  authorizeRoles("teacher", "admin"),
  rejectBlog
);


// Like / Unlike  ← must be before /:id to avoid route conflict
router.post(
  "/:id/like",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  toggleLike
);


// Toggle save  ← before /:id
router.post(
  "/:id/save",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  toggleSave
);


// Add comment
router.post(
  "/:id/comments",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  addComment
);


// Delete comment
router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  deleteComment
);


//view details
router.get(
  "/:id",
  (req, res, next) => {
    console.log("BLOG DETAIL ROUTE HIT:", req.params.id);
    next();
  },
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  getBlogById
);

// Create blog
router.post(
  "/",
  authMiddleware,
  authorizeRoles("student"),
  upload.single("image"),
  createBlog
);


// Update my blog
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("student"),
  upload.single("image"),
  updateBlog
);


// Delete my blog
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("student","admin"),
  deleteBlog
);

router.post(
  "/:id/comments/:commentId/replies",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  addReply
);

router.delete(
  "/:id/comments/:commentId/replies/:replyId",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  deleteReply
);

router.patch(
  "/:id/comments/:commentId/like",
  (req, res, next) => {
    console.log("COMMENT LIKE ROUTE HIT");
    next();
  },
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  toggleCommentLike
);

router.patch(
  "/:id/comments/:commentId/replies/:replyId/like",
  authMiddleware,
  authorizeRoles("student", "teacher", "admin"),
  toggleReplyLike
);


export default router;