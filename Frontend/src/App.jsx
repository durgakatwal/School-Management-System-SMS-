// src/App.jsx
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminSignUp from "./pages/Signup";
import AppLayout from "./components/layout/AppLayout";
// import Dashboard from "./pages/Dashboard";
// import Trips from "./pages/Trips";
import Redirector from "./pages/Redirector";

// Role-Based Dashboards
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Calender from "./pages/AdminPages/Calender";
import Fees from "./pages/AdminPages/Fees";
import SchoolExpenses from "./pages/AdminPages/SchoolExpenses";
import Attendance from "./pages/AdminPages/Attendance";
import Subjects from "./pages/AdminPages/Subjects";
import Classes from "./pages/AdminPages/Classes";
import Reports from "./pages/AdminPages/Reports";
import NoticeBoard from "./pages/AdminPages/NoticeBoard";
import Student from "./pages/AdminPages/Student";
import Teacher from "./pages/AdminPages/Teacher";
import MessagesPage from "./pages/Message";

const App = () => {
  const { token, logout } = useAuth();

  const ProtectedRoute = ({ children }) => {
    try {
      if (!token) {
        logout();
        return <Navigate to="/login" />;
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (currentTime > decoded.exp) {
        logout();
        return <Navigate to="/login" />;
      }

      return children;
    } catch (err) {
      logout();
      return <Navigate to="/login" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/*  This is the magic route */}
        <Route path="/" element={<Redirector />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<AdminSignUp />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/trips" element={<Trips />} /> */}

          {/* Role-Specific Dashboards */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student" element={<Student />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/school-expenses" element={<SchoolExpenses />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notices" element={<NoticeBoard />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
