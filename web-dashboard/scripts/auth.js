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

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
  }
}
window.login = login;


// ---------------- REGISTER ----------------
async function register() {
  const email = document.getElementById("reg-email")?.value;
  const password = document.getElementById("reg-password")?.value;
  const confirmPassword = document.getElementById("reg-confirm-password")?.value;

  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

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

  // Validate password strength
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registration successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Registration error:", error);
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
  
  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    alert(error.message);
  }
}
window.forgotPassword = forgotPassword;


// ---------------- TOGGLE PASSWORD VISIBILITY ----------------
function togglePassword(id) {
  const passField = document.getElementById(id);
  if (passField) {
    passField.type = passField.type === "password" ? "text" : "password";
    
    // Find the toggle button (eye icon) and update it
    const toggleBtn = passField.parentElement.querySelector('.toggle-password');
    if (toggleBtn) {
      toggleBtn.textContent = passField.type === "password" ? "👁️" : "🙈";
    }
  }
}
window.togglePassword = togglePassword;


// ---------------- THEME TOGGLE ----------------
function toggleTheme() {
  document.body.classList.toggle("dark");
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = newTheme === "dark" ? "🌙" : "☀️";
  }
}
window.toggleTheme = toggleTheme;


// ---------------- GOOGLE SIGN-IN ----------------
async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google login successful:", result.user);
    alert("Google login successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Google login error:", error);
    alert(error.message);
  }
}
window.googleLogin = googleLogin;


// ---------------- ADDITIONAL REGISTER PAGE FUNCTIONS ----------------
function validateEmail() {
  const email = document.getElementById("reg-email")?.value;
  const errorElement = document.getElementById("email-error");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email && !emailPattern.test(email)) {
    if (errorElement) errorElement.style.display = "block";
    return false;
  } else {
    if (errorElement) errorElement.style.display = "none";
    return true;
  }
}
window.validateEmail = validateEmail;

function checkPasswordStrength() {
  const password = document.getElementById("reg-password")?.value;
  const strengthContainer = document.getElementById("password-strength");
  const strengthText = document.getElementById("strength-text");
  const bars = document.querySelectorAll(".strength-bar");
  
  if (!password) {
    if (strengthContainer) strengthContainer.style.display = "none";
    return;
  }
  
  if (strengthContainer) strengthContainer.style.display = "flex";
  
  let strength = 0;
  let strengthLabel = "Weak";
  
  // Check password criteria
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  // Reset all bars
  bars.forEach(bar => {
    bar.className = "strength-bar";
  });
  
  // Set strength level and color bars
  if (strength >= 4) {
    strengthLabel = "Strong";
    for (let i = 0; i < 4; i++) {
      bars[i]?.classList.add("strong");
    }
  } else if (strength >= 2) {
    strengthLabel = "Medium";
    for (let i = 0; i < 2; i++) {
      bars[i]?.classList.add("medium");
    }
  } else {
    strengthLabel = "Weak";
    bars[0]?.classList.add("weak");
  }
  
  if (strengthText) strengthText.textContent = strengthLabel;
}
window.checkPasswordStrength = checkPasswordStrength;

function validatePasswordMatch() {
  const password = document.getElementById("reg-password")?.value;
  const confirmPassword = document.getElementById("reg-confirm-password")?.value;
  const errorElement = document.getElementById("confirm-error");
  const successElement = document.getElementById("confirm-success");
  
  if (confirmPassword && password !== confirmPassword) {
    if (errorElement) errorElement.style.display = "block";
    if (successElement) successElement.style.display = "none";
    return false;
  } else if (confirmPassword && password === confirmPassword) {
    if (errorElement) errorElement.style.display = "none";
    if (successElement) successElement.style.display = "block";
    return true;
  } else {
    if (errorElement) errorElement.style.display = "none";
    if (successElement) successElement.style.display = "none";
    return false;
  }
}
window.validatePasswordMatch = validatePasswordMatch;