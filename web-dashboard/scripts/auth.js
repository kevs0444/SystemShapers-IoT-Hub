import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebase-config.js';

// Login function
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (error) {
    throw error; // Handle in UI
  }
};

// Register function
export const register = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "login.html";
  } catch (error) {
    throw error;
  }
};