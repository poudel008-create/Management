import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { getBlogs } from "../../services/blogService";
import ProfileEditor from "../../components/ProfileEditor";

import { UserCog, Users, BookOpen } from "lucide-react";

const TeacherProfile = () => {
  const { token } = useAuth();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs(token);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchBlogs();
    }
  }, [token]);

  // Unique students who have written at least one blog
  const activeStudents = new Set(
    blogs.filter((blog) => blog.author).map((blog) => blog.author._id)
  ).size;

  return (
    <ProfileEditor
      title="Teacher Profile"
      badgeLabel="Teacher"
      badgeIcon={UserCog}
      stats={[
        { label: "Active Students", value: activeStudents, icon: Users },
        { label: "Blogs to Explore", value: blogs.length, icon: BookOpen },
      ]}
    />
  );
};

export default TeacherProfile;