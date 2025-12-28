import axios from "axios";
import mem from "mem";
import { STORAGE_NAME } from "../context/AuthContext";

const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL;

// axios public instance
export const axiosPublic = axios.create({
  baseURL: SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Get access token from localStorage
const getAccessToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_NAME));
    return user?.accessToken || null;
  } catch (e) {
    return null;
  }
};

// refresh jwt
export const refresh = async () => {
  try {
    const res = await axiosPublic.get("/api/auth/refresh", {
      withCredentials: true,
    });
    if (res.data?.accessToken) {
      // Update access token in localStorage
      const user = JSON.parse(localStorage.getItem(STORAGE_NAME));
      if (user) {
        user.accessToken = res.data.accessToken;
        localStorage.setItem(STORAGE_NAME, JSON.stringify(user));
      }
      return res.data.accessToken;
    }
    return null;
  } catch (e) {
    console.log("Refresh token error:", e);
    // if refresh token expired, logout the user and clear cookies
    localStorage.removeItem(STORAGE_NAME);
    window.location.href = "/login";
    return null;
  }
};

// memoized refresh token function to prevent excessive fxn calls
export const memoizedRefreshJwt = mem(refresh, {
  maxAge: 10000,
});

// axios private instance
export const axiosPrivate = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

// axios interceptors request
axiosPrivate.interceptors.request.use(
  async (config) => {
    // Get access token from localStorage
    const accessToken = getAccessToken();
    
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// axios interceptors response
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const newAccessToken = await memoizedRefreshJwt();

      if (newAccessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };
        return axiosPrivate(config);
      } else {
        // Refresh failed, redirect to login
        localStorage.removeItem(STORAGE_NAME);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
