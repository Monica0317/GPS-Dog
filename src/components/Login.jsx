import React, { useState } from "react";
import Imagen from "../assets/perrito1.png";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";  // Importa las funciones para interactuar con la base de datos
import { appFirebase, database } from "../credenciales";  // Importación nombrada

const auth = getAuth(appFirebase);

const Login = () => {
    const [registrando, setRegistrando] = useState(false);

    const funcAuth = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();  // Elimina espacios adicionales
        const password = e.target.password.value;
        const user = e.target.user?.value;  // Solo se toma cuando es registro

        try {
            if (!registrando) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: user,  // Establece el nombre de usuario
                });
                await set(ref(database, 'users/' + userCredential.user.uid), {
                    username: user,
                    email: email
                });
                alert("Usuario registrado exitosamente");
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                alert("Sesión iniciada exitosamente");
            }
        } catch (error) {
            if (error.code === 'auth/invalid-email') {
                alert('El correo electrónico no es válido.');
            } else if (error.code === 'auth/weak-password') {
                alert('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
            } else if (error.code === 'auth/email-already-in-use') {
                alert('El correo electrónico ya está en uso.');
            } else {
                console.error("Error en la autenticación:", error.message);
                alert("Error: " + error.message);
            }
        }
        
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <div className="padre">
                        <div className="card card-body shadow">
                            <form onSubmit={funcAuth}>
                                {!registrando && (
                                    <input type="text" placeholder="Ingresar Usuario" className="cajatexto" id="user" />
                                )}
                                <input type="email" placeholder="Ingresar Email" className="cajatexto" id="email" required />
                                <input type="password" placeholder="Ingresar Contraseña" className="cajatexto" id="password" required />
                                {!registrando && (
                                    <input type="password" placeholder="Confirmar Contraseña" className="cajatexto" id="confirmPassword" required />
                                )}
                                <button className="btnform">
                                    {registrando ? "Iniciar Sesión" : "Registrarse"}
                                </button>
                            </form>
                            <h5 className="texto">
                                {registrando ? "¿No tienes cuenta?" : "Si ya tienes cuenta"}
                                <button className="btnswitch" onClick={() => setRegistrando(!registrando)}>
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
    );
};

export default Login;