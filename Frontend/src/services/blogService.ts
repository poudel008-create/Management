import api from "./api";

// CREATE BLOG
export const createBlog = async (
  title: string,
  content: string,
  image: File | null,
  videoId: string | null,
  token: string
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }
  

  if (videoId) {
    formData.append("videoId", videoId);
  }

  const response = await api.post(
    "/blogs",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// GET ALL BLOGS
export const getBlogs = async (token: string) => {
  const response = await api.get("/blogs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// GET MY BLOGS
export const getMyBlogs = async (token: string) => {
  const response = await api.get("/blogs/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// GET BLOG BY ID
export const getBlogById = async (
  id: string,
  token: string
) => {
  const response = await api.get(
    `/blogs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// UPDATE BLOG
export const updateBlog = async (
  id: string,
  title: string,
  content: string,
  image: File | null,
  token: string
) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }

  const response = await api.put(
    `/blogs/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// DELETE BLOG
export const deleteBlog = async (
  id: string,
  token: string
) => {
  const response = await api.delete(
    `/blogs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};