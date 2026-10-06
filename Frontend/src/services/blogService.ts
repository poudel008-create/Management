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
  token: string,
  videoId?: string | null
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
  token: string,
  reason:string
) => {
  const response = await api.delete(
    `/blogs/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data:{reason}
    }
  );

  return response.data;
};


// TOGGLE LIKE
export const toggleLike = async (
  id: string,
  token: string
) => {
  const response = await api.post(
    `/blogs/${id}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


// ADD COMMENT
export const addComment = async (
  id: string,
  text: string,
  token: string
) => {
  const response = await api.post(
    `/blogs/${id}/comments`,
    { text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const addReply = async (
  blogId: string,
  commentId: string,
  text: string,
  token: string,
  replyId?: string
) => {
  const response = await api.post(
    `/blogs/${blogId}/comments/${commentId}/replies`,
    {
      text,
      ...(replyId && { replyId }),
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
export const deleteReply = async (
  blogId: string,
  commentId: string,
  replyId: string,
  token: string
) => {
  const response = await api.delete(
    `/blogs/${blogId}/comments/${commentId}/replies/${replyId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const toggleCommentLike = async (
  blogId: string,
  commentId: string,
  token: string
) => {
  const response = await api.patch(
    `/blogs/${blogId}/comments/${commentId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const toggleReplyLike = async (
  blogId: string,
  commentId: string,
  replyId: string,
  token: string
) => {
  const response = await api.patch(
    `/blogs/${blogId}/comments/${commentId}/replies/${replyId}/like`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


// DELETE COMMENT
export const deleteComment = async (
  blogId: string,
  commentId: string,
  token: string
) => {
  const response = await api.delete(
    `/blogs/${blogId}/comments/${commentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


// TOGGLE SAVE
export const toggleSave = async (
  id: string,
  token: string
) => {
  const response = await api.post(
    `/blogs/${id}/save`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};


// GET SAVED BLOGS
export const getSavedBlogs = async (token: string) => {
  const response = await api.get("/blogs/saved", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// GET BLOGS FOR REVIEW
export const getReviewBlogs = async (status: string, token: string) => {
  const response = await api.get(`/blogs/review?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


// APPROVE BLOG
export const approveBlog = async (id: string, token: string) => {
  const response = await api.patch(
    `/blogs/${id}/approve`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


// REJECT BLOG
export const rejectBlog = async (id: string, reason: string, token: string) => {
  const response = await api.patch(
    `/blogs/${id}/reject`,
    { reason },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};