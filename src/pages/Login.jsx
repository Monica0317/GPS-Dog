import React, { useContext } from "react";
import Imagen from "../assets/perrito1.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { appFirebase, database } from "../credenciales";

const auth = getAuth(appFirebase);

const Login = () => {
  const { registrando, setRegistrando } = useContext(AuthContext);
  const navigate = useNavigate();
  const funcAuth = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const user = e.target.user?.value;

    try {
      if (!registrando) {
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
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        alert("Sesión iniciada exitosamente");
        if (userCredential.user) {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("El correo electrónico no es válido.");
      } else if (error.code === "auth/weak-password") {
        alert(
          "La contraseña es demasiado débil. Debe tener al menos 6 caracteres."
        );
      } else if (error.code === "auth/email-already-in-use") {
        alert("El correo electrónico ya está en uso.");
      } else {
        console.error("Error en la autenticación:", error.message);
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-vh-100 min-vw-100 justify-content-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="padre">
              <div className="card card-body shadow">
                <form onSubmit={funcAuth}>
                  {!registrando && (
                    <input
                      type="text"
                      placeholder="Ingresar Usuario"
                      className="cajatexto"
                      id="user"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Ingresar Email"
                    className="cajatexto"
                    id="email"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Ingresar Contraseña"
                    className="cajatexto"
                    id="password"
                    required
                  />
                  {!registrando && (
                    <input
                      type="password"
                      placeholder="Confirmar Contraseña"
                      className="cajatexto"
                      id="confirmPassword"
                      required
                    />
                  )}
                  <button className="btnform">
                    {registrando ? "Iniciar Sesión" : "Registrarse"}
                  </button>
                </form>
                <h5 className="texto">
                  {registrando ? "¿No tienes cuenta?" : "Si ya tienes cuenta"}
                  <button
                    className="btnswitch"
                    onClick={() => setRegistrando(!registrando)}
                  >
                    {registrando ? "Regístrate" : "Inicia sesión"}
                  </button>
                </h5>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <img src={Imagen} alt="" className="tamaño-imagen" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;