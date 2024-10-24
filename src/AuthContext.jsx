import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [registrando, setRegistrando] = useState(false);

  return (
    <AuthContext.Provider value={{ registrando, setRegistrando }}>
      {children}
    </AuthContext.Provider>
  );
};
