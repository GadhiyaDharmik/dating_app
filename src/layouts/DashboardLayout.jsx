// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../component/SideBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
