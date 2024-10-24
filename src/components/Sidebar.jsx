import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Map, Bell, History, Book, LogOut, PawPrint } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const Sidebar = ({ usuario, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const menuItems = [
    {
      title: "Perfil de Mascota",
      icon: <PawPrint size={20} />,
      path: "/perfil-mascota",
    },
    {
      title: "Mapa en tiempo real",
      icon: <Map size={20} />,
      path: "/mapa",
    },
    {
      title: "Alertas y Notificaciones",
      icon: <Bell size={20} />,
      path: "/notificaciones",
    },
    {
      title: "Historial de recorridos",
      icon: <History size={20} />,
      path: "/historial",
    },
    {
      title: "Consejos y Recursos",
      icon: <Book size={20} />,
      path: "/recursos",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("isAuthenticated");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div
      className={`
      bg-light border-end d-flex flex-column
      position-fixed start-0 top-0 bottom-0
      ${isSidebarOpen ? "show" : "hidden"}
      d-lg-flex
    `}
      style={{
        width: "280px",
        zIndex: 1040,
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Perfil */}
      <div className="p-4 border-bottom">
        <h5 className="mb-1">{usuario.displayName || usuario.email}</h5>
        <small className="text-muted">{usuario.email}</small>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-grow-1 p-3">
        <div className="list-group list-group-flush">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 
                ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-3 border-top mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
