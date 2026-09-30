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
  authorizeRoles("student"),
  deleteBlog
);


export default router;