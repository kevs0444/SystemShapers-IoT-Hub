import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCsjVZk2SRofOnlKQVqe1eB4Nvh3JNmqbY",
  authDomain: "systemshapers-iot-hub.firebaseapp.com",
  projectId: "systemshapers-iot-hub",
  storageBucket: "systemshapers-iot-hub.appspot.com",
  messagingSenderId: "172181849234",
  appId: "1:172181849234:web:641514c5e50f0dcfb6924b",
  measurementId: "G-R0SX3TS6JC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
