import express from "express";

import authMiddleware from "../middleware/authmiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  refreshAccessToken,
  getAllUsers,
  updateUserRole,
  updateProfile,
  changePassword,
  getStudents
  
} from "../Controller/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/refresh", refreshAccessToken);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.get(
  "/users",
  authMiddleware,
  authorizeRoles("admin"),
  getAllUsers
);

router.put(
  "/users/:id/role",
  authMiddleware,
  authorizeRoles("admin"),
  updateUserRole
);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

router.get("/students", authMiddleware, authorizeRoles("teacher", "admin"), getStudents);
export default router;