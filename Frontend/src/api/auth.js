// import api from "./axios";

// export const registerUser = async (data) => {
//   const res = await api.post("/admin/register", data);
//   return res.data;
// };

// export const loginUser = async (data) => {
//   const res = await api.post("/admin/login", data);
//   return res.data;
// };
import api from "./axios";

/**
 * Universal Register Function (Admin/Teacher/Student)
 * @param {Object} data - registration data
 * @param {"admin" | "teacher" | "student"} role - must be passed explicitly
 */
export const registerUser = async (data, role) => {
  try {
    const endpoints = {
      admin: "/admin/register",
      teacher: "/teachers/register",
      student: "/students/StudentReg",
    };

    if (!role || !endpoints[role.toLowerCase()]) {
      throw new Error("Invalid role provided for registerUser");
    }

    const res = await api.post(endpoints[role.toLowerCase()], data);
    return res.data;
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg || // express-validator errors
      error.message ||
      "Registration failed";
    console.error(`❌ Register ${role} failed:`, errMsg);
    throw { message: errMsg };
  }
};

/**
 * Universal Login Function (Admin/Teacher/Student)
 * @param {Object} data - login credentials
 * @param {"admin" | "teacher" | "student"} role - must be passed explicitly
 */
export const loginUser = async (data, role) => {
  try {
    const endpoints = {
      admin: "/admin/login",
      teacher: "/teachers/login",
      student: "/students/StudentLogin",
    };

    if (!role || !endpoints[role.toLowerCase()]) {
      throw new Error("Invalid role provided for loginUser");
    }

    const res = await api.post(endpoints[role.toLowerCase()], data);
    return res.data; // { token, user }
  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      "Login failed";
    console.error(`❌ Login ${role} failed:`, errMsg);
    throw { message: errMsg };
  }
};
