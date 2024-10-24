import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = ({ usuario }) => {
  const navigate = useNavigate();
  const auth = getAuth();

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
    <div>
      <h2>
        Bienvenido {usuario.displayName ? usuario.displayName : usuario.email}
      </h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Home;
