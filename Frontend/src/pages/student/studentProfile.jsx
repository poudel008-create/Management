import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { getMyBlogs } from "../../services/blogService";
import ProfileEditor from "../../components/ProfileEditor";

import { GraduationCap, FileText, Clock } from "lucide-react";

const StudentProfile = () => {
  const { token } = useAuth();

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getMyBlogs(token);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchBlogs();
    }
  }, [token]);

  const latest = blogs[0]?.createdAt
    ? new Date(blogs[0].createdAt).toLocaleDateString()
    : "—";

  return (
    <ProfileEditor
      title="Student Profile"
      badgeLabel="Student"
      badgeIcon={GraduationCap}
      stats={[
        { label: "Blogs Written", value: blogs.length, icon: FileText },
        { label: "Latest Post", value: latest, icon: Clock },
      ]}
    />
  );
};

export default StudentProfile;