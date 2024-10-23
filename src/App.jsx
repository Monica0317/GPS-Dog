import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { appFirebase } from './credenciales';  // Importación nombrada

import Login from './components/Login';
import Home from './components/Home';

import './App.css';

// Inicializar la autenticación con Firebase
const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);  // Guarda el objeto completo del usuario
      } else {
        setUsuario(null);
      }
      setLoading(false);  // Finaliza el estado de carga
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;  // Estado de carga
  }

  return (
    <div>
      {usuario ? <Home usuario={usuario} /> : <Login />}
    </div>
  );
}

export default App;
