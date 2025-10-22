import { create } from "zustand";
import axios from "../api/axios";

const useAuthStore = create((set, get) => ({
  user: null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
  isAuthenticated: !!localStorage.getItem("access"),

  login: async (username, password) => {
    try {
      const res = await axios.post("/auth/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      set({
        access: res.data.access,
        refresh: res.data.refresh,
        isAuthenticated: true,
      });

      await get().fetchUser();
      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const res = await axios.get("/auth/profile/");
      set({ user: res.data });
    } catch (err) {
      console.error("Fetch user failed:", err);
      set({ isAuthenticated: false, user: null });
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ user: null, access: null, refresh: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
