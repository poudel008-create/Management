import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyBlogs, updateBlog } from "../../services/blogService";
import { useAuth } from "../../context/authContext";

import {
  ArrowLeft,
  FileText,
  Image,
  Save,
} from "lucide-react";

const EditBlog = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      if (!token) return;

      try {
        const data = await getMyBlogs(token);

        const blog = data.blogs.find(
          (blog) => blog._id === id
        );

        if (!blog) {
          alert("Blog not found");
          navigate("/my-blogs");
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
        setOldImage(blog.image || "");

      } catch (error) {
        console.log(error);
      }
    };

    fetchBlog();
  }, [id, token, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !id) return;

    try {
      await updateBlog(
        id,
        title,
        content,
        image,
        token
      );

      alert("Blog updated successfully");

      navigate("/user/my-blogs");

    } catch (error) {
      console.log(error);
      alert("Failed to update blog");
    }
  };


  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate("/user/my-blogs")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600 transition mb-5"
        >
          <ArrowLeft size={17} />
          Back to My Blogs
        </button>

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
              Blog Editor
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-1">
              Edit Your Blog
            </h1>

            <p className="text-slate-500 mt-2">
              Update your blog content and cover image.
            </p>
          </div>

        </div>

      </div>


      {/* Editor Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="bg-purple-50 border-b border-purple-100 px-6 sm:px-8 py-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-white text-purple-600 flex items-center justify-center border border-purple-100">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Update Your Blog
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Make changes to your published blog.
              </p>
            </div>

          </div>

        </div>


        <form onSubmit={handleSubmit} className="p-6 sm:p-8">

          {/* Title */}
          <div className="mb-7">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blog Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              required
            />

          </div>


          {/* Current Image */}
          {oldImage && (
            <div className="mb-7">

              <p className="text-sm font-semibold text-slate-700 mb-3">
                Current Image
              </p>

              <div className="rounded-xl overflow-hidden border border-slate-200">

                <img
                  src={oldImage}
                  alt={title}
                  className="w-full max-h-72 object-cover"
                />

              </div>

            </div>
          )}


          {/* New Image */}
          <div className="mb-7">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Change Image
            </label>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50/40 transition">

                <div className="w-11 h-11 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                  <Image size={21} />
                </div>

                <p className="font-medium text-slate-700">
                  {image
                    ? image.name
                    : "Click to choose a new image"}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  PNG, JPG or JPEG
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) =>
                    setImage(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />

              </div>

            </label>

          </div>


          {/* Content */}
          <div className="mb-8">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Blog Content
            </label>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 leading-7 outline-none resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
              required
            />

          </div>


          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/user/my-blogs")}
              className="px-5 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-sm"
            >
              <Save size={18} />
              Update Blog
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditBlog;