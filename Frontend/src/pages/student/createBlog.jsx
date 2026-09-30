import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../services/blogService";
import { useAuth } from "../../context/authContext";

import {
  PenLine,
  Image,
  FileText,
  ArrowLeft,
} from "lucide-react";

const CreateBlog = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    try {
      await createBlog(title, content, image, token);

      alert("Blog created successfully");

      setTitle("");
      setContent("");
      setImage(null);

      navigate("/user/my-blogs");
    } catch (error) {
      console.log(error);
      alert("Failed to create blog");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate("/user")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600 transition mb-5"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <PenLine size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-purple-600 uppercase">
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
        <div className="bg-purple-200 px-6 sm:px-8 py-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-purple-800/70 text-white flex items-center justify-center">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="text-purple-800 text-lg font-semibold">
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog title..."
              className="w-full text-xl sm:text-2xl font-semibold text-slate-800 placeholder:text-slate-300 border-b-2 border-slate-200 focus:border-purple-600 outline-none pb-4 transition"
              required
            />

          </div>


          {/* Image */}
          <div className="px-6 sm:px-8 pt-8">

            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Cover Image
            </label>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50/40 transition">

                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
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
                    setImage(e.target.files?.[0] || null)
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
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your blog here..."
              rows={14}
              className="w-full resize-none text-slate-700 leading-7 placeholder:text-slate-300 border border-slate-200 rounded-xl p-5 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              required
            />

          </div>


          {/* Buttons */}
          <div className="px-6 sm:px-8 py-7 mt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">

            <button
              type="button"
              onClick={() => navigate("/user")}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-sm transition"
            >
              <PenLine size={18} />
              Publish Blog
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateBlog;