import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  deleteNotification,
} from "../Controller/notificationController.js";

const router = express.Router();

const auth = [authMiddleware, authorizeRoles("student", "teacher", "admin")];

router.get("/", auth, getNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.patch("/read-all", auth, markAllRead);   // must be before /:id/read
router.patch("/:id/read", auth, markOneRead);
router.delete("/:id", auth, deleteNotification);

export default router;
