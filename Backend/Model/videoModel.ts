import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    uploadId: {
      type: String,
      required: true,
      unique: true,
    },

    assetId: {
      type: String,
    },

    playbackId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["uploading", "ready", "errored"],
      default: "uploading",
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;