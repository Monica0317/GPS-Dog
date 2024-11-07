import React, { useContext } from "react";
import Imagen from "../assets/perrito1.png";
import styles from "../styles/Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { appFirebase } from "../credenciales";

const auth = getAuth(appFirebase);

const Login = () => {
  const navigate = useNavigate();
  const { setRegistrando } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("Sesión iniciada exitosamente");
      if (userCredential.user) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("El correo electrónico no es válido.");
      } else if (error.code === "auth/wrong-password") {
        alert("Contraseña incorrecta.");
      } else if (error.code === "auth/user-not-found") {
        alert("Usuario no encontrado.");
      } else {
        console.error("Error en la autenticación:", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  const handleNavigateToSignUp = () => {
    setRegistrando(false);
    navigate("/signup");
  };

  return (
    <div
      className={`min-vh-100 min-vw-100 justify-content-center ${styles.pageContainer}`}
    >
      <div className={`container ${styles.container}`}>
        <div className={`row ${styles.row}`}>
          <div className={`col-md-4 ${styles.column}`}>
            <div className={`padre ${styles.padre}`}>
              <div className={`${styles.card}`}>
                <form onSubmit={handleLogin} className={styles.form}>
                  <div className={`display-4  fw-bold ${styles.titulo}`}>
                    Login
                  </div>
                  <div className={styles.inputGroup}>
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      placeholder="Ingresar Email"
                      className={` ${styles.input}`}
                      id="email"
                      required
                    />
                  </div>
                  <div className={styles.inputGroups}>
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      placeholder="Ingresar Contraseña"
                      className={` ${styles.input}`}
                      id="password"
                      required
                    />
                  </div>
                  <button type="submit" className={`${styles.button}`}>
                    Iniciar Sesión
                  </button>
                </form>
                <h5 className={` ${styles.text}`}>
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    className={` ${styles.switchButton}`}
                    onClick={handleNavigateToSignUp}
                  >
                    Regístrate
                  </button>
                </h5>
              </div>
            </div>
          </div>
          <div className={`col-md-8 ${styles.imageColumn}`}>
            <img src={Imagen} alt="" className={`${styles.image}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
