import { createContext, useContext, useState, useEffect } from "react";
import {
  refreshAccessToken, getProfile,logoutUser
} from "../services/authService.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

 const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.log(error);
  }

  setUser(null);
  setToken(null);
};
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await refreshAccessToken();

        setToken(data.accessToken);



        const profileData = await getProfile(data.accessToken);

        setUser(profileData.user);

      } catch (error) {
        setUser(null);
        setToken(null);
      }
      finally {
        setLoading(false)
      }
    };

    checkAuth();

  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        logout,
        login,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};