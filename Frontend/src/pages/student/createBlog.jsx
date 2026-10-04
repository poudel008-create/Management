import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createBlog } from "../../services/blogService";
import { getUploadUrl, checkVideoStatus } from "../../services/videoService";
import { useAuth } from "../../context/authContext";

import {
  PenLine,
  Image,
  FileText,
  Video,
  ArrowLeft,
} from "lucide-react";

const CreateBlog = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const backPath = location.state?.from || "/user";

  const backLabel =
    backPath === "/user/my-blogs"
      ? "My Blogs"
      : "Dashboard";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    try {
      setLoading(true);

      let videoId = null;

      // Upload video to Mux
      if (video) {
        const uploadData = await getUploadUrl(
          title,
          token
        );

        console.log("UPLOAD DATA:", uploadData);

        const uploadResponse = await fetch(
          uploadData.uploadUrl,
          {
            method: "PUT",
            body: video,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Video upload failed");
        }

        const uploadId = uploadData.uploadId;
        videoId = uploadData.videoId;

        console.log("UPLOAD COMPLETE");
        console.log("MongoDB Video ID:", videoId);
        console.log("Mux Upload ID:", uploadId);
        let videoReady = false;

        for (let i = 0; i < 60; i++) {
          await new Promise((resolve) =>
            setTimeout(resolve, 5000)
          );

          const statusData = await checkVideoStatus(
            uploadId,
            token
          );

          console.log("VIDEO STATUS:", statusData);

          if (statusData.status === "ready") {
            videoReady = true;
            break;
          }

          if (statusData.status === "errored") {
            throw new Error("Mux video processing failed");
          }
        }

        if (!videoReady) {
          throw new Error(
            "Video processing took too long"
          );
        }
        console.log("MONGODB VIDEO ID:", videoId);
      }

      await createBlog(
        title,
        content,
        image,
        videoId,
        token
      );

      alert("Blog created successfully");

      setTitle("");
      setContent("");
      setImage(null);
      setVideo(null);

      navigate("/user/my-blogs");

    } catch (error) {
      console.log(error);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition mb-5"
        >
          <ArrowLeft size={17} />
          Back to {backLabel}
        </button>

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <PenLine size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">
              Blog Editor
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-1">
              Create Your Blog
            </h1>

            <p className="text-slate-500 mt-2">
              Share your knowledge, ideas, and experiences with the community.
            </p>
          </div>

        </div>
      </div>


      {/* Editor Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Card Header */}
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 sm:px-8 py-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="text-slate-800 text-lg font-semibold">
                Write Something Interesting
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Create a blog and share it with other students.
              </p>
            </div>

          </div>

        </div>


        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="px-6 sm:px-8 pt-8">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Blog Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter your blog title..."
              className="w-full text-xl sm:text-2xl font-semibold text-slate-800 placeholder:text-slate-300 border-b-2 border-slate-200 focus:border-indigo-600 outline-none pb-4 transition"
              required
            />

          </div>


          {/* Cover Image */}
          <div className="px-6 sm:px-8 pt-8">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Cover Image
            </label>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/40 transition">

                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Image size={23} />
                </div>

                <p className="font-medium text-slate-700">
                  {image
                    ? image.name
                    : "Click to upload a cover image"}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  PNG, JPG or JPEG
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) =>
                    setImage(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </div>

            </label>

          </div>


          {/* Video */}
          <div className="px-6 sm:px-8 pt-8">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Blog Video
            </label>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/40 transition">

                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Video size={23} />
                </div>

                <p className="font-medium text-slate-700">
                  {video
                    ? video.name
                    : "Click to upload a video"}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  MP4, MOV or WebM
                </p>

                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    setVideo(
                      e.target.files?.[0] || null
                    )
                  }
                />

              </div>

            </label>

          </div>


          {/* Content */}
          <div className="px-6 sm:px-8 pt-8">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Blog Content
            </label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Start writing your blog here..."
              rows={14}
              className="w-full resize-none text-slate-700 leading-7 placeholder:text-slate-300 border border-slate-200 rounded-xl p-5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              required
            />

          </div>


          {/* Buttons */}
          <div className="px-6 sm:px-8 py-7 mt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">

            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm transition disabled:opacity-50"
            >
              <PenLine size={18} />

              {loading
                ? "Publishing..."
                : "Publish Blog"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateBlog;