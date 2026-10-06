const homeFor = (role) =>
  role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/user";

// Where the user was before opening the full notifications page
export const getNotificationsBackTarget = (location, role) => {
  const from = location.state?.from;

  if (from && !from.startsWith("/notifications")) {
    return from;
  }

  // Opened directly by URL: fall back to the role's home page
  return homeFor(role);
};

// Leave the full page and reopen the small dropdown on the previous page
export const closeNotificationsPage = (navigate, location, role) => {
  navigate(getNotificationsBackTarget(location, role), {
    replace: true,
    state: { openNotifications: true },
  });
};