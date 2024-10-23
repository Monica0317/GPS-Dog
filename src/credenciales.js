import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWP0j73-oEgzMsYrCxZYs9iUmvvZFmCts",
  authDomain: "gps-dog-fe011.firebaseapp.com",
  projectId: "gps-dog-fe011",
  storageBucket: "gps-dog-fe011.appspot.com",
  messagingSenderId: "603847652949",
  appId: "1:603847652949:web:89f946aea76c8fe13fc6dc",
  databaseURL: "https://gps-dog-fe011-default-rtdb.firebaseio.com"
};

// Inicializa la app Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inicializa la base de datos Realtime Database
const database = getDatabase(appFirebase);

// Cambia la exportación a exportación nombrada
export { appFirebase, database };
