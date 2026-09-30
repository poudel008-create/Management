import { useEffect, useState } from "react";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { getBlogById } from "../services/blogService";
import { useAuth } from "../context/authContext";


const BlogDetails = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const { id } = useParams();

    const { token } = useAuth();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!token) return;

            try {
                const data = await getBlogById(id, token);
                setBlog(data.blog);
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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">
                    Loading blog...
                </p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-slate-800">
                    Blog not found
                </h2>

                <button
                    onClick={() => navigate(location.state?.from || "/blogs")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">

            {/* BACK BUTTON */}
            <div className="max-w-4xl mx-auto px-6 pt-6">
                <button
                    onClick={() => navigate(location.state?.from || "/blogs")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            {/* BLOG */}
            <article className="max-w-4xl mx-auto px-6 py-8">

                {/* IMAGE */}
                {blog.image && (
                    <div className="h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-200">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* CONTENT */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 mt-6">

                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                        Blog
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                        {blog.title}
                    </h1>

                    {/* AUTHOR */}
                    <div className="flex items-center gap-3 mt-6 pb-6 border-b border-slate-200">

                        <div className="w-11 h-11 rounded-full bg-slate-900/70 text-white flex items-center justify-center font-semibold">
                            {blog.author?.name
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <p className="font-semibold text-slate-700">
                                {blog.author?.name || "Unknown Author"}
                            </p>

                            <p className="text-sm text-slate-400">
                                {blog.author?.role || "Author"}
                            </p>
                        </div>

                    </div>

                    {/* BLOG CONTENT */}
                    <div className="mt-8">
                        <p className="text-slate-700 leading-8 whitespace-pre-line">
                            {blog.content}
                        </p>
                    </div>

                </div>

            </article>

        </div>
    );
};

export default BlogDetails;