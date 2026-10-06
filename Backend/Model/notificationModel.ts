import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: "like" | "comment" | "new_blog" | "new_user" | "blog_approved" | "blog_rejected" | "blog_removed";

  blog?: mongoose.Types.ObjectId;
  commentText?: string;
  read: boolean;
  blogTitle?: string;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "new_blog", "new_user", "blog_approved", "blog_rejected","blog_removed"],
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    commentText: {
      type: String,
      maxlength: 100,
    },
    read: {
      type: Boolean,
      default: false,
    },
    blogTitle: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
