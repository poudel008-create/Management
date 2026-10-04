import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { getAllUsers } from "../../services/authService";
import { getBlogs } from "../../services/blogService";
import ProfileEditor from "../../components/ProfileEditor";

import { ShieldCheck, Users, BookOpen } from "lucide-react";

const AdminProfile = () => {
  const { token } = useAuth();

  const [userCount, setUserCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, blogData] = await Promise.all([
          getAllUsers(token),
          getBlogs(token),
        ]);

        setUserCount((userData.users || []).length);
        setBlogCount((blogData.blogs || []).length);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <ProfileEditor
      title="Admin Profile"
      badgeLabel="Administrator"
      badgeIcon={ShieldCheck}
      stats={[
        { label: "Total Users", value: userCount, icon: Users },
        { label: "Total Blogs", value: blogCount, icon: BookOpen },
      ]}
    />
  );
};

export default AdminProfile;