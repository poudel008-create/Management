import api from "./api";

const headers = (token) => ({ Authorization: `Bearer ${token}` });

export const getNotifications = async (token) => {
  const res = await api.get("/notifications", { headers: headers(token) });
  return res.data;
};

export const getUnreadCount = async (token) => {
  const res = await api.get("/notifications/unread-count", { headers: headers(token) });
  return res.data;
};

export const markNotificationRead = async (id, token) => {
  const res = await api.patch(`/notifications/${id}/read`, {}, { headers: headers(token) });
  return res.data;
};

export const markAllNotificationsRead = async (token) => {
  const res = await api.patch("/notifications/read-all", {}, { headers: headers(token) });
  return res.data;
};

export const deleteNotification = async (id, token) => {
  const res = await api.delete(`/notifications/${id}`, { headers: headers(token) });
  return res.data;
};
