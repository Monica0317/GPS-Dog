import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css"; 

const Home = ({ usuario }) => {
  return (
    <Layout usuario={usuario}>
      <div className={`container-fluid ${styles.container}`}>
        <div className={`card ${styles.card}`}>
          <div className={`card-body ${styles.cardBody}`}>
            <h2 className={`display-4  fw-bold ${styles.cardTitle}`}>
              Bienvenido a PetTracker
            </h2>
            <p className={` ${styles.cardText}`}>
              Selecciona una opción del menú para comenzar.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
