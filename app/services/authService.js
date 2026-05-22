import axiosInstance from "../utils/axiosInstance";

export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (username, email, password, confirmPassword) => {
    const response = await axiosInstance.post("/auth/register", {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },
};
