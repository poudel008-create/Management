import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-50 overflow-hidden">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64 h-screen">
        
        <div className="fixed top-0 left-0 lg:left-64 right-0 z-30">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        <main className="h-screen overflow-y-auto pt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;