import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

import AdminD from "./pages/admin/adminDashboard";

import TeacherD from "./pages/teacher/teacherDashboard";
import StudentDetails from "./pages/teacher/studentDetails";

import UserD from "./pages/student/userDashboard";
import CreateBlog from "./pages/student/createBlog";
import MyBlogs from "./pages/student/myBlog";
import EditBlog from "./pages/student/editBlog";
import StudentProfile from "./pages/student/studentProfile";
import Blogs from "./pages/blogs";
import BlogDetails from "./pages/viewDetails";
import UsersDetails from "./pages/admin/usersDetails";
import ManageRoles from "./pages/admin/manageRoles";
import TeacherProfile from "./pages/teacher/teacherProfile";

import ProtectedRoute from "./context/protectedRoutes";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminLayout from "./layouts/AdminLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element=
          {<ProtectedRoute roles={["admin", "teacher", "student"]}>
            <DashboardLayout />
          </ProtectedRoute>
          }
        >

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminD />} />

            <Route path="users" element={<UsersDetails />} />
            <Route path="roles" element={<ManageRoles />} />
            <Route path="blogs" element={<Blogs />} />

          </Route>


          <Route
            path="/teacher"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherD />} />

            <Route path="students" element={<StudentDetails />}/>
            <Route path="blogs" element={<Blogs />}/>
            <Route path="profile" element={<TeacherProfile />}/>

          </Route>


          <Route
            path="/user"
            element={
              <ProtectedRoute roles={["student"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserD />} />

            <Route path="create-blog" element={<CreateBlog />}/>
            <Route path="my-blogs" element={<MyBlogs />}/>
            <Route path="edit-blog/:id" element={<EditBlog />}/>
            <Route path="blogs" element={<Blogs />}/>

            <Route path="profile" element={<StudentProfile />}/>

          </Route>


          <Route
            path="/blogs"
            element={
              <ProtectedRoute
                roles={["admin", "teacher", "student"]}
              >
                <Blogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute
                roles={["admin", "teacher", "student"]}
              >
                <BlogDetails />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;