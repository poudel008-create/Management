import express from "express";

import {
  createUploadUrl,
  muxWebhook,
  getVideos,
  checkVideoStatus,
} from "../Controller/videoController.js";

const router = express.Router();

router.post("/upload-url", createUploadUrl);

router.post("/webhook", muxWebhook);

router.get("/", getVideos);
router.get(
  "/status/:uploadId",
  checkVideoStatus
);
router.get("/test", (req, res) => {
  res.json({
    message: "Video route working",
  });
});

export default router;