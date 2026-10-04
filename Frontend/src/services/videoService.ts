import axios from "axios";

const API_URL = "http://localhost:3000/api/videos";

export const getUploadUrl = async (
  title: string,
  token: string
) => {
  const response = await axios.post(
    `${API_URL}/upload-url`,
    {
      title,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getVideos = async (
  token: string
) => {
  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const checkVideoStatus = async (
  uploadId: string,
  token: string
) => {
  const response = await axios.get(
    `${API_URL}/status/${uploadId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};