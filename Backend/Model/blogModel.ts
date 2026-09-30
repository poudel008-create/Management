import mongoose, { Schema, Document } from "mongoose";

interface IBlog extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    image?: string
}

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
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;