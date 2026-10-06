import { useNavigate } from "react-router-dom";
import { CalendarDays, Heart, ImageOff, Play } from "lucide-react";

/*
  Props
  - blog:   the blog object
  - from:   path to return to when the user presses Back on the details page
  - action: (optional) React node shown on the right, e.g. an un-like button
*/
const BlogListItem = ({ blog, from = "/blogs", action = null }) => {
  const navigate = useNavigate();

  const hasVideo = !!blog.video?.playbackId;

  const thumb =
    blog.image ||
    (hasVideo
      ? `https://image.mux.com/${blog.video.playbackId}/thumbnail.jpg?width=240`
      : null);

  const authorName = blog.author?.name || "Unknown Author";

  const open = () => {
    navigate(`/blogs/${blog._id}`, { state: { from } });
  };

  return (
    <div
      onClick={open}
      className="group flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm hover:border-indigo-300 hover:shadow-md transition cursor-pointer"
    >

      {/* Small thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">

        {thumb ? (
          <img
            src={thumb}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-300">
            <ImageOff size={22} />
          </div>
        )}

        {hasVideo && (
          <span className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
            <Play size={11} />
          </span>
        )}

      </div>


      {/* Text */}
      <div className="min-w-0 flex-1">

        <h2 className="text-base font-bold text-slate-800 truncate group-hover:text-indigo-600 transition">
          {blog.title}
        </h2>

        <p className="text-sm text-slate-500 mt-0.5 leading-5 line-clamp-2">
          {blog.content}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-400">

          <span className="flex items-center gap-1.5 min-w-0">
            <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </span>

            <span className="font-medium text-slate-600 truncate">
              {authorName}
            </span>
          </span>

          {blog.createdAt && (
            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              {new Date(blog.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}

          {Array.isArray(blog.likes) && (
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {blog.likes.length}
            </span>
          )}

        </div>

      </div>


      {/* Optional action (un-like / un-save) */}
      {action && (
        <div
          className="shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {action}
        </div>
      )}

    </div>
  );
};

export default BlogListItem;