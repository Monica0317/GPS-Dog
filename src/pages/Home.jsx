import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const Home = ({ usuario }) => {
  return (
    <Layout usuario={usuario}>
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title mb-4">Bienvenido a PetTracker</h2>
            <p className="card-text text-muted">
              Selecciona una opción del menú para comenzar.
            </p>
            {/* Botón para ir a la página de Consejos y Recursos */}
            <Link to="/recursos">
              <button className="btn btn-primary mt-3">
                Consejos y Recursos
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
