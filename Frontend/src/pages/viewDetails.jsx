import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { getBlogById } from "../services/blogService";
import { useAuth } from "../context/authContext";
import MuxPlayer from "@mux/mux-player-react";
const BlogDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { token } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  // Came from inside the app -> go back there, otherwise the blogs list
  const goBack = () => navigate(location.state?.from || "/blogs");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id, token);
        setBlog(data.blog);
        console.log("BLOG DETAIL:", data.blog);
        console.log("VIDEO:", data.blog.videoId);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-500">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-slate-800">
          Blog not found
        </h2>

        <p className="text-slate-500 mt-2">
          This blog may have been deleted or the link is incorrect.
        </p>

        <button
          onClick={goBack}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={17} />
          Go Back
        </button>
      </div>
    );
  }

  const paragraphs = (blog.content || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // const wordCount = (blog.content || "")
  //   .trim()
  //   .split(/\s+/)
  //   .filter(Boolean).length;

  // const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const authorInitial =
    blog.author?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition mb-5"
      >
        <ArrowLeft size={17} />
        Back
      </button>


      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10">

          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-tight wrap-break-word">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-5">

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {authorInitial}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-slate-800">
                  {blog.author?.name || "Unknown Author"}
                </p>

                <p className="text-xs text-slate-400 capitalize">
                  {blog.author?.role || "Author"}
                </p>
              </div>

            </div>

            <span className="hidden sm:block w-px h-6 bg-slate-200"></span>

            {blog.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays size={14} />
                {new Date(blog.createdAt).toLocaleDateString(
                  undefined,
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </div>
            )}
            {/* 
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={14} />
              {readingTime} min read
            </div> */}

          </div>

        </div>


      {/* Cover Photo / Video */}
{blog.image && (
  <div className="px-6 sm:px-10 mt-7">
    <div className="aspect-2/1 rounded-xl overflow-hidden bg-slate-100 relative">

      {!showVideo ? (
        <>
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />

          {blog.videoId?.playbackId && (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition group"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 group-hover:scale-110 transition flex items-center justify-center shadow-lg">
                <span className="text-indigo-600 text-2xl ml-1">
                  ▶
                </span>
              </span>
            </button>
          )}
        </>
      ) : (
        <MuxPlayer
          playbackId={blog.videoId.playbackId}
          streamType="on-demand"
          className="w-full h-full"
        />
      )}

    </div>
  </div>
)}

        {/* Content */}
        <div className="px-6 sm:px-10 py-8 sm:py-10">

          {paragraphs.map((text, index) => (
            <p
              key={index}
              className="text-[17px] text-slate-700 leading-8 mb-5 last:mb-0 wrap-break-word"
            >
              {text}
            </p>
          ))}

        </div>


        {/* Footer */}
        <div className="px-6 sm:px-10 py-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              {authorInitial}
            </div>

            <div className="leading-tight">
              <p className="text-xs text-slate-400">
                Written by
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {blog.author?.name || "Unknown Author"}
              </p>
            </div>

          </div>

          <button
            onClick={goBack}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20"
          >
            <ArrowLeft size={16} />
            Back to blogs
          </button>

        </div>

      </article>

    </div>
  );
};

export default BlogDetails;