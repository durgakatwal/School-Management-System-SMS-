import React from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "../shared/AppNavbar";

const AppLayout = () => {
  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
