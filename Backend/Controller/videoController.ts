import { Request, Response } from "express";
import mux from "../config/mux.js";
import Video from "../Model/videoModel.js";


// CREATE MUX UPLOAD URL
export const createUploadUrl = async (
  req: Request,
  res: Response
) => {
  try {
   

    const upload = await mux.video.uploads.create({
      cors_origin: "http://localhost:5173",
      new_asset_settings: {
        playback_policy: ["public"],
      },
    });


    const video = await Video.create({
      title: req.body.title || "Blog Video",
      uploadId: upload.id,
      status: "uploading",
    });

   

    res.status(200).json({
      uploadUrl: upload.url,
      uploadId: upload.id,
      videoId: video._id.toString(),
    });
  } catch (error) {
   

  console.log("MUX UPLOAD ERROR:", error);   // <-- add this

  res.status(500).json({
    message: "Failed to create upload URL",
  });
}
  
  
};

// MUX WEBHOOK
export const muxWebhook = async (
  req: Request,
  res: Response
) => {
  try {
    const event = req.body;

    console.log("Mux webhook event:", event.type);

    if (event.type === "video.asset.ready") {
      const asset = event.data;

      const playbackId =
        asset.playback_ids?.[0]?.id;

      if (!playbackId) {
        return res.status(400).json({
          message: "Playback ID not found",
        });
      }

      await Video.findOneAndUpdate(
        {
          uploadId: asset.upload_id,
        },
        {
          assetId: asset.id,
          playbackId: playbackId,
          status: "ready",
        }
      );
    }

    if (event.type === "video.asset.errored") {
      const asset = event.data;

      await Video.findOneAndUpdate(
        {
          uploadId: asset.upload_id,
        },
        {
          status: "errored",
        }
      );
    }

    res.status(200).json({
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Mux webhook error:", error);

    res.status(500).json({
      message: "Webhook failed",
    });
  }
};


// GET VIDEOS
export const getVideos = async (
  req: Request,
  res: Response
) => {
  try {
    const videos = await Video.find({
      status: "ready",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Get videos error:", error);

    res.status(500).json({
      message: "Failed to get videos",
    });
  }
};

export const checkVideoStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const uploadId = req.params.uploadId as string;

    const video = await Video.findOne({ uploadId });

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const upload = await mux.video.uploads.retrieve(uploadId);

    // Asset create bhayeko chaina
    if (!upload.asset_id) {
      return res.status(200).json({
        status: "uploading",
      });
    }

    // Asset retrieve
    const asset = await mux.video.assets.retrieve(
      upload.asset_id
    );

    // Video ready
    if (asset.status === "ready") {
      const playbackId =
        asset.playback_ids?.[0]?.id;

      await Video.findByIdAndUpdate(video._id, {
        assetId: asset.id,
        playbackId,
        status: "ready",
      });

      return res.status(200).json({
        status: "ready",
        playbackId,
      });
    }

    // Video errored
    if (asset.status === "errored") {
      await Video.findByIdAndUpdate(video._id, {
        assetId: asset.id,
        status: "errored",
      });

      return res.status(200).json({
        status: "errored",
      });
    }

    return res.status(200).json({
      status: "processing",
    });
  } catch (error) {
    console.error("CHECK VIDEO STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to check video status",
    });
  }
};