import mongoose, { Schema, Document } from "mongoose";

interface INestedReply {
  _id?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IReply {
  _id?: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  // Level 2
  replies?: INestedReply[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IComment {
  _id?: mongoose.Types.ObjectId;
  text: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  replies: IReply[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IBlog extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  image?: string;
  videoId?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
}

/* =========================================
   LEVEL 2 REPLY
   Reply -> Nested Reply
   ========================================= */

const nestedReplySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/* =========================================
   LEVEL 1 REPLY
   Comment -> Reply -> Nested Reply
   ========================================= */

const replySchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Only ONE nested level allowed
    replies: {
      type: [nestedReplySchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* =========================================
   COMMENT
   ========================================= */

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Now uses commentSchema (one single definition, no duplicate inline copy)
    comments: {
      type: [commentSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;