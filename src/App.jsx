import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./credenciales";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Map from "./pages/Map";
import Tips from "./pages/Tips";
import HistorialRecorridos from "./pages/HistorialRecorridos";

import "./App.css";

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
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              usuario ? (
                <>
                  <nav>
                    <Link to="/">Inicio</Link>
                  </nav>
                  <Home usuario={usuario} />
                </>
              ) : (
                <Index />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/perfil-mascota"
            element={
              <>
                <Perfil usuario={usuario} />
              </>
            }
          />
          <Route
            path="/mapa"
            element={
              <>
                <Map usuario={usuario} />
              </>
            }
          />
          <Route
            path="/recursos"
            element={
              <>
                <nav>
                  <Link to="/">Inicio</Link>
                  <Link to="/recursos">Consejos y Recursos</Link>
                </nav>
                <Tips />
              </>
            }
          />
          <Route
            path="/historial"
            element={
              <>
                <nav>
                  <Link to="/">Inicio</Link>
                  <Link to="/historial">Historial de Recorridos</Link>
                </nav>
                <HistorialRecorridos />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
