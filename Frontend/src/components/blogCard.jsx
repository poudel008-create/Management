import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  ImageOff,
  Play,
} from "lucide-react";

/*
  Props
  - blog:   the blog object
  - from:   path to return to when the user presses Back on the details page
  - action: (optional) a React node shown on the top-right of the image,
            e.g. an un-like or un-save button
*/
const BlogCard = ({ blog, from = "/blogs", action = null }) => {
  const navigate = useNavigate();

  const hasVideo = !!blog.video?.playbackId;

  const thumb =
    blog.image ||
    (hasVideo
      ? `https://image.mux.com/${blog.video.playbackId}/thumbnail.jpg?width=640`
      : null);

  const authorName = blog.author?.name || "Unknown Author";

  const open = () => {
    navigate(`/blogs/${blog._id}`, { state: { from } });
  };

  return (
    <article
      onClick={open}
      className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col"
    >

      {/* Image */}
      <div className="relative h-40 bg-slate-100 overflow-hidden shrink-0">

        {thumb ? (
          <img
            src={thumb}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <ImageOff size={26} />
            <span className="text-xs mt-1.5">No image</span>
          </div>
        )}

        {hasVideo && (
          <span className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center">
            <Play size={14} />
          </span>
        )}

        {action && (
          <div
            className="absolute top-2 right-2"
            onClick={(e) => e.stopPropagation()}
          >
            {action}
          </div>
        )}

      </div>


      {/* Content */}
      <div className="p-4 flex flex-col flex-1">

        <h2 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
          {blog.title}
        </h2>

        <p className="text-sm text-slate-500 mt-1.5 leading-5 line-clamp-2">
          {blog.content}
        </p>


        {/* Meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">

          {Array.isArray(blog.likes) && (
            <span className="flex items-center gap-1">
              <Heart size={13} />
              {blog.likes.length}
            </span>
          )}

          {blog.createdAt && (
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}

        </div>


        {/* Footer */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-4">

          <div className="flex items-center gap-2 min-w-0">

            <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>

            <p className="text-xs font-medium text-slate-600 truncate">
              {authorName}
            </p>

          </div>

          <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 shrink-0">
            View details
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition"
            />
          </span>

        </div>

      </div>

    </article>
  );
};

export default BlogCard;