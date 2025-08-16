import { auth } from "./firebase-config.js";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";


// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}
window.login = login;


// ---------------- REGISTER ----------------
async function register() {
  const email = document.getElementById("reg-email")?.value;
  const password = document.getElementById("reg-password")?.value;
  const confirmPassword = document.getElementById("reg-confirm-password")?.value;

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}
window.register = register;


// ---------------- FORGOT PASSWORD ----------------
async function forgotPassword() {
  const email = document.getElementById("email")?.value;
  if (!email) {
    alert("Please enter your email first.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  } catch (error) {
    alert(error.message);
  }
}
window.forgotPassword = forgotPassword;


// ---------------- TOGGLE PASSWORD VISIBILITY ----------------
function togglePassword(id) {
  const passField = document.getElementById(id);
  if (passField) {
    passField.type = passField.type === "password" ? "text" : "password";
  }
}
window.togglePassword = togglePassword;


// ---------------- THEME TOGGLE ----------------
function toggleTheme() {
  document.body.classList.toggle("dark");
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }
}
window.toggleTheme = toggleTheme;


// ---------------- GOOGLE SIGN-IN ----------------
async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    alert("Google login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}
window.googleLogin = googleLogin;
