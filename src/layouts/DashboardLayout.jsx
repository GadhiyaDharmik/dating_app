// src/layouts/DashboardLayout.jsx
import React from "react";
import Sidebar from "../component/SideBar";
import StarRatingBar from "../component/StarRatingBar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (fixed height) */}
      <Sidebar />
      {/* <StarRatingBar /> */}

      {/* Main scrollable content area */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        {/* Content inside this should scroll, not the whole page */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4">
          <StarRatingBar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
