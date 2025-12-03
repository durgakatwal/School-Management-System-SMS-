// src/pages/Redirector.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "@/hooks/useAuth";

export default function Redirector() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // Not logged in → go to login
      navigate("/login");
      return;
    }

    try {
      // ✅ Use role from user if available, otherwise decode token
      let role = user?.role;
      if (!role) {
        const decoded = jwtDecode(token);
        role = decoded?.role;
      }

      if (!role) {
        navigate("/login");
        return;
      }

      // 🔁 Redirect based on role
      switch (role.toLowerCase()) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [token, user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
}
