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