import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./db.js";
import authRoutes from "./Routes/userRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js"
import videoRoutes from "./Routes/videoRoutes.js"
import seedAdmin from "./seedAdmin.js";



const app = express();

const CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(CorsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

console.log("BLOG ROUTES FILE LOADED");
app.use("/api/blogs", blogRoutes);
app.use("/api/videos",videoRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/test", (req, res) => {
  console.log("SERVER TEST HIT");

  res.json({
    message: "Server is working",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  await seedAdmin();

  console.log(`Server running on http://localhost:${PORT}`);
});