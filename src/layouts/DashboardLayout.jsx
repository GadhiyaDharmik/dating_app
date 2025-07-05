import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../component/SideBar";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  // Example: adjust for your actual route path
  const isMessagePage = location.pathname.includes("/dashboard/messages");

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full overflow-hidden">
        {isMessagePage ? (
          // For MessagePage: no scroll in layout, let MessagePage handle it
          <div className="flex-1">{children}</div>
        ) : (
          // Default: scrollable main content
          <div className="flex-1 overflow-y-auto custom-scroll p-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
