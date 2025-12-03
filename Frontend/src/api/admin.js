import api from "./axios";

// Fetch stats for Admin Dashboard
export const fetchAdminStats = async () => {
  try {
    const res = await api.get("/admin/stats");
    return res.data;
  } catch (error) {
    console.error(
      " Failed to fetch stats:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch stats" };
  }
};
