import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import styles from "../styles/Index.module.css";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const Index = () => {
  const { setRegistrando } = useContext(AuthContext);

  return (
    
    <div className={`min-vh-100 min-vw-100 justify-content-center ${styles.pageContainer}`}>
      <header className="container0">
        <nav>
      <Link
        to="/login"
        className={`${styles.primaryButton}`}
        onClick={() => setRegistrando(false)}
      >
        Crear Cuenta
      </Link>
      <Link
        to="/login"
        className={`${styles.secondaryButton}`}
        onClick={() => setRegistrando(true)}
      >
        Iniciar Sesión
      </Link>
      </nav>
      </header>
     

      <div className={`${styles.contentContainer}`}>
        <img src="/src/assets/perros.png" alt="Perro" className={`${styles.dogImage}`} />

        {/* Logo y Título */}
        <div className={`${styles.centerContent} `}>
          <div className={`${styles.textContainer}`}>
            <PawPrint className={`${styles.paw} display-4 fw-bold text-primary`} size={48} />
            <h1 className={`${styles.title} display-4 fw-bold text-primary`}>PawTracker</h1>
            <p className={`${styles.subtitle}`}>
              Mantén a tu mejor amigo seguro y localizado en todo momento
            </p>
          </div>
        </div>

        {/* Carrusel con GIF */}
        <div id="carouselExampleCaptions" className={`carousel slide ${styles.carousel}`} data-bs-ride="carousel">
          <div className={`carousel-inner ${styles.carouselInner}`}>
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <img src="/src/assets/gif_historial.gif" alt="GIF animado" className={`${styles.gifImage}`} />
            </div>
          </div>
          <button className={`carousel-control-prev ${styles.carouselControlPrev}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`} aria-hidden="true"></span>
            <span className={`visually-hidden ${styles.visuallyHidden}`}></span>
          </button>
          <button className={`carousel-control-next ${styles.carouselControlNext}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`} aria-hidden="true"></span>
            <span className={`visually-hidden ${styles.visuallyHidden}`}></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
