import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import styles from "../styles/Index.module.css";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";

const Index = () => {
  const { setRegistrando } = useContext(AuthContext);

  return (
    <div
      className={`min-vh-100 min-vw-100 justify-content-center ${styles.pageContainer}`}
    >
      <header className={`${styles.container0}`}>
        <nav>
          <Link
            to="/signup"
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
        <img src="/perros.png" alt="Perro" className={`${styles.dogImage}`} />

        {/* Logo y Título */}
        <div className={`${styles.centerContent}`}>
          <div className={`${styles.textContainer}`}>
            <PawPrint
              className={`${styles.paw} display-4 fw-bold `}
              size={48}
            />
            <h1 className={`${styles.title} display-3 fw-bold `}>PawTracker</h1>
            <p className={`${styles.subtitle}`}>
              Mantén a tu mejor amigo seguro y localizado en todo momento
            </p>
          </div>
        </div>

        {/* Carrusel con dos GIFs */}
        <div
          id="carouselExampleIndicators"
          className={`carousel slide ${styles.carousel}`}
          data-bs-ride="carousel"
        >
          {/* Indicadores */}
          <div className={`carousel-indicators ${styles.carouselIndicators}`}>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className={`carousel-inner ${styles.carouselInner}`}>
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <img
                src="/gif_historial.gif"
                alt="GIF historial"
                className={`${styles.gifImage}`}
              />
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <img
                src="/gif_rastreo.gif"
                alt="GIF zona segura"
                className={`${styles.gifImage}`}
              />
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <img
                src="/gif_zona.gif"
                alt="GIF zona segura"
                className={`${styles.gifImage}`}
              />
            </div>
          </div>

          {/* Controles de navegación */}
          <button
            className={`carousel-control-prev ${styles.carouselControlPrev}`}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`}
              aria-hidden="true"
            ></span>
            <span className="visually-hidden"></span>
          </button>
          <button
            className={`carousel-control-next ${styles.carouselControlNext}`}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`}
              aria-hidden="true"
            ></span>
            <span className="visually-hidden"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
