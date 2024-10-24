import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { appFirebase } from "./credenciales";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Index from "./components/Index";

import "./App.css";

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para manejar la recarga de la página
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

    // Verificar si hay una sesión guardada al cargar la página
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
      <Routes>
        <Route
          path="/"
          element={usuario ? <Home usuario={usuario} /> : <Index />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
