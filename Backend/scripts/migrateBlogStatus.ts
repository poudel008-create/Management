import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../db.js";
import Blog from "../Model/blogModel.js";

await connectDB();

const result = await Blog.updateMany(
  { status: { $exists: false } },
  { $set: { status: "approved" } }
);

console.log(`Migration complete: ${result.modifiedCount} blog(s) updated to "approved".`);

await mongoose.disconnect();
process.exit(0);
