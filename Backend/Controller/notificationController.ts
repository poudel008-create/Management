import { Request, Response } from "express";
import Notification from "../Model/notificationModel.js";


// GET /api/notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("sender", "name role")
      .populate("blog", "title");

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.log("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};


// GET /api/notifications/unread-count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.log("GET UNREAD COUNT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};


// PATCH /api/notifications/read-all
export const markAllRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.log("MARK ALL READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};


// PATCH /api/notifications/:id/read
export const markOneRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.log("MARK ONE READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};


// DELETE /api/notifications/:id
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await notification.deleteOne();

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.log("DELETE NOTIFICATION ERROR:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
