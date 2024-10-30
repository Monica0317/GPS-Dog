import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { appFirebase } from "./credenciales";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Map from "./pages/Map";
import Tips from "./pages/Tips"; // Importa el componente de Tips

import "./App.css";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = () => {
      signOut(auth).catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        sessionStorage.setItem("isAuthenticated", "true");
        setUsuario(usuarioFirebase);
      } else {
        sessionStorage.removeItem("isAuthenticated");
        setUsuario(null);
      }
      setLoading(false);
    });

    const checkSession = () => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      if (!isAuthenticated) {
        signOut(auth).catch((error) => {
          console.error("Error al cerrar sesión:", error);
        });
      }
    };

    checkSession();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      {usuario && (
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/recursos">Consejos y Recursos</Link> {/* Enlace a "Consejos y Recursos" */}
        </nav>
      )}
      <Routes>
        <Route
          path="/"
          element={usuario ? <Home usuario={usuario} /> : <Index />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil-mascota" element={<Perfil usuario={usuario} />} />
        <Route path="/mapa" element={<Map usuario={usuario} />} />
        <Route
          path="/notificaciones"
          element={<div>Notificaciones en construcción</div>}
        />
        <Route
          path="/historial"
          element={<div>Historial en construcción</div>}
        />
        <Route path="/recursos" element={<Tips />} /> {/* Ruta a Tips */}
      </Routes>
    </Router>
  );
}

export default App;
