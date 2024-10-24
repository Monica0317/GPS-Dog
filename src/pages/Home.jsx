import React from "react";
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
