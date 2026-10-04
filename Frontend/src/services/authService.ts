import api from "./api";

interface UserData {
  name?: string;
  email: string;
  password: string;
}

interface UserRole {
  userId: string;
  role: "student" | "teacher";
  token: string;
}

interface ProfileData {
  name: string;
  email: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export const registerUser = async (userData: UserData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData: UserData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllUsers = async (token: string) => {
  const response = await api.get("/auth/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");

  return response.data;
};

export const updateUserRole = async ({
  userId,
  role,
  token,
}: UserRole) => {
  const response = await api.put(
    `/auth/users/${userId}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// NEW: edit own name / email
export const updateProfile = async (
  profileData: ProfileData,
  token: string
) => {
  const response = await api.put("/auth/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// NEW: change own password
export const changePassword = async (
  passwordData: PasswordData,
  token: string
) => {
  const response = await api.put("/auth/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// NEW: list of all students (for teachers and admins)
export const getStudents = async (token: string) => {
  const response = await api.get("/auth/students", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};