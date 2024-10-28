import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import styles from "../styles/Index.module.css";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";


const Index = () => {
  const { setRegistrando } = useContext(AuthContext);

  return (

    <div className={`${styles.pageContainer}`}>
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
    

      <div className={`${styles.contentContainer}`}>
      <img src="/src/assets/perros.png" alt="Perro" className={`${styles.dogImage}`} />

        {/* Logo y Título */}
        <div className={`${styles.centerContent} ${styles.mbLarge}`}>
          <div className={`${styles.textContainer}`}>
            <PawPrint className={`${styles.paw} display-4 fw-bold text-primary`} size={48} />
            <h1 className={`${styles.title} display-4 fw-bold text-primary`}>PawTracker</h1>
            <p className={`${styles.subtitle}`}>
              Mantén a tu mejor amigo seguro y localizado en todo momento
            </p>
          </div>
        </div>

        {/* Carrusel con tarjetas */}
        <div id="carouselExampleCaptions" className={`carousel slide ${styles.carousel}`} data-bs-ride="carousel">
          <div className={`carousel-indicators ${styles.carouselIndicators}`}>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className={`carousel-inner ${styles.carouselInner}`}>
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <div className={`card h-100 text-center shadow-sm ${styles.featureCard} ${styles.shadow}`}>
                <div className={`${styles.cardBody} card-body`}>
                  <h3 className={` ${styles.cardTitle} `}>Rastreo en Tiempo Real</h3>
                  <p className={`${styles.cardText} card-text`}>
                    Sigue los pasos de tu mascota con precisión GPS
                  </p>
                </div>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className={`card h-100 text-center shadow-sm ${styles.featureCard} ${styles.shadow}`}>
                <div className={`${styles.cardBody}`}>
                  <h3 className={` ${styles.cardTitle}`}>Zonas Seguras</h3>
                  <p className={`${styles.cardText}`}>
                    Establece perímetros seguros y recibe alertas
                  </p>
                </div>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className={`card h-100 text-center shadow-sm ${styles.featureCard} ${styles.shadow}`}>
                <div className={`${styles.cardBody}`}>
                  <h3 className={`${styles.cardTitle}`}>Historial de Rutas</h3>
                  <p className={`${styles.cardText}`}>
                    Visualiza los recorridos diarios de tu mascota
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className={`carousel-control-prev ${styles.carouselControlPrev}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`} aria-hidden="true"></span>
            <span className={`visually-hidden ${styles.visuallyHidden}`}></span>
          </button>
          <button className={`carousel-control-next ${styles.carouselControlNext}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className={`#carousel-Example-Captions${styles.carouselControlNextIcon}`} aria-hidden="true"></span>
            <span className={`carousel-control-next-icon ${styles.visuallyHidden}`}></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
