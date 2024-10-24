import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import styles from "./Index.module.css";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const Index = () => {
  const { setRegistrando } = useContext(AuthContext);

  return (
    <div className="min-vh-100 min-vw-100 d-flex flex-column justify-content-center">
      <div className="container">
        {/* Logo y Título */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-12 col-lg-8">
            <PawPrint className="text-primary mb-3" size={48} />
            <h1 className="display-4 fw-bold text-primary">PawTracker</h1>
            <p className="lead text-secondary">
              Mantén a tu mejor amigo seguro y localizado en todo momento
            </p>
          </div>
        </div>

        {/* Características */}
        <div className="row justify-content-center g-4 mb-5">
          <div className="col-12 col-md-4 col-lg-3">
            <div
              className={`card h-100 text-center shadow-sm ${styles.indexCard} ${styles.indexShadowSm}`}
            >
              <div className="card-body">
                <h3 className="h5 text-primary">Rastreo en Tiempo Real</h3>
                <p className="card-text">
                  Sigue los pasos de tu mascota con precisión GPS
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              className={`card h-100 text-center shadow-sm ${styles.indexCard} ${styles.indexShadowSm}`}
            >
              <div className="card-body">
                <h3 className="h5 text-primary">Zonas Seguras</h3>
                <p className="card-text">
                  Establece perímetros seguros y recibe alertas
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div
              className={`card h-100 text-center shadow-sm ${styles.indexCard} ${styles.indexShadowSm}`}
            >
              <div className="card-body">
                <h3 className="h5 text-primary">Historial de Rutas</h3>
                <p className="card-text">
                  Visualiza los recorridos diarios de tu mascota
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="d-flex flex-column align-items-center gap-3">
          <Link
            to="/login"
            className={`btn btn-primary rounded-pill px-5 py-2 ${styles.indexBtn}`}
            onClick={() => setRegistrando(false)}
          >
            Crear Cuenta
          </Link>
          <Link
            to="/login"
            className={`btn btn-outline-primary rounded-pill px-5 py-2 ${styles.indexBtn}`}
            onClick={() => setRegistrando(true)}
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
