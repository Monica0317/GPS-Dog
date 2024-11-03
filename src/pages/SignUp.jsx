import React, { useContext } from "react";
import Imagen from "../assets/perrito1.png";
import styles from "../styles/SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { appFirebase, database } from "../credenciales";

const auth = getAuth(appFirebase);

const SignUp = () => {
  const navigate = useNavigate();
  const { setRegistrando } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const user = e.target.user.value;

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      await updateProfile(userCredential.user, {
        displayName: user,
      });
      
      await set(ref(database, "users/" + userCredential.user.uid), {
        username: user,
        email: email,
      });
      
      alert("Usuario registrado exitosamente");
      if (userCredential.user) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("El correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        alert("La contraseña es demasiado débil. Debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/email-already-in-use") {
        alert("El correo electrónico ya está en uso.");
      } else {
        console.error("Error en la autenticación:", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  const handleNavigateToLogin = () => {
    setRegistrando(true);
    navigate('/login');
  };

  return (
    <div className={`min-vh-100 min-vw-100 justify-content-center ${styles.pageContainer}`}>
      <div className={`container ${styles.container}`}>
        <div className={`row ${styles.row}`}>
          <div className={`col-md-4 ${styles.column}`}>
            <div className={`padre ${styles.padre}`}>
              <div className={`${styles.card}`}>
                <form onSubmit={handleSignUp} className={styles.form}>
                  <input
                    type="text"
                    placeholder="Ingresar Usuario"
                    className={`cajatexto ${styles.input}`}
                    id="user"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Ingresar Email"
                    className={`cajatexto ${styles.input}`}
                    id="email"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Ingresar Contraseña"
                    className={`cajatexto ${styles.input}`}
                    id="password"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    className={`cajatexto ${styles.input}`}
                    id="confirmPassword"
                    required
                  />
                  <button type="submit" className={`btnform ${styles.button}`}>
                    Registrarse
                  </button>
                </form>
                <h5 className={`texto ${styles.text}`}>
                  Si ya tienes cuenta
                  <button
                    type="button"
                    className={`btnswitch ${styles.switchButton}`}
                    onClick={handleNavigateToLogin}
                  >
                    Inicia sesión
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

export default SignUp;