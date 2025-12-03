// components/layout/AppNavbar.jsx
import React from "react";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const AppNavbar = () => {
  const { user, logout } = useAuth(); // assuming user contains { role: "Admin" | "Teacher" | "Student" }

  // Define menu items based on role
  const menuByRole = {
    Admin: [
      { to: "/admin-dashboard", label: "Dashboard" },
      { to: "/student", label: "Students" },
      { to: "/teacher", label: "Teachers" },
      { to: "/classes", label: "Classes" },
      { to: "/subjects", label: "Subjects" },
      { to: "/attendance", label: "Attendance" },
      { to: "/notices", label: "Notices" },
      { to: "/fees", label: "Fees" },
    ],
    Teacher: [
      { to: "/teacher-dashboard", label: "Dashboard" },
      { to: "/my-classes", label: "My Classes" },
      { to: "/attendance", label: "Attendance" },
    ],
    Student: [
      { to: "/student-dashboard", label: "Dashboard" },
      { to: "/my-subjects", label: "My Subjects" },
      { to: "/attendance", label: "Attendance" },
    ],
  };

  const menuItems = menuByRole[user?.role] || [];

  return (
    <header className="flex items-center justify-between py-2 px-8 border-b bg-white shadow-sm sticky">
      {/* Logo + School Name */}
      <a href="/admin-dashboard">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" alt="logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold text-primary">ABC School</h1>
        </div>
      </a>
      {/* Navigation Links */}
      <nav className="flex items-center gap-6 text-sm">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold underline"
                : "hover:underline"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AppNavbar;
