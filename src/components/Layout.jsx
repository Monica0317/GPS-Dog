import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

const Layout = ({ usuario, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="d-flex min-vh-100">
      {/* Botón para móvil */}
      <button
        className="btn btn-light d-lg-none position-fixed"
        style={{ top: "1rem", left: "1rem", zIndex: 1050 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <Sidebar usuario={usuario} isSidebarOpen={isSidebarOpen} />

      {/* Contenido principal */}
      <main
        className="flex-grow-1 p-4"
        style={{
          marginLeft: isSidebarOpen ? "280px" : "0",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
