import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";


// ---------------- ACTION CODE SETTINGS ----------------
// 🔧 Update this to match your domain or Firebase Hosting URL
const actionCodeSettings = {
  url: "http://localhost:3000/web-dashboard/public/register", // Redirect after verification/reset
  handleCodeInApp: true,
};


// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      alert("Please verify your email address before signing in. Check your inbox for the verification email.");
      await signOut(auth);
      return;
    }
    
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // ✅ Send email verification with redirect settings
    await sendEmailVerification(user, actionCodeSettings);
    alert("Registration successful! Please check your email to verify your account before signing in.");
    
    // Sign out the user until they verify their email
    await signOut(auth);
    window.location.href = "login.html";
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
    // ✅ Send reset email with redirect settings
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    console.error("Password reset error:", error);
    alert(error.message);
  }
}
window.forgotPassword = forgotPassword;


// ---------------- TOGGLE PASSWORD VISIBILITY ----------------
function togglePassword(fieldId = 'password') {
  const passField = document.getElementById(fieldId);
  if (passField) {
    passField.type = passField.type === 'password' ? 'text' : 'password';
    
    // Find the toggle button (SVG icon) and update it
    const toggleBtn = passField.parentElement.querySelector('.toggle-password svg');
    if (toggleBtn) {
      if (passField.type === 'password') {
        // Show eye icon (password hidden)
        toggleBtn.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      } else {
        // Show eye-off icon (password visible)
        toggleBtn.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      }
    }
  }
}

// Make togglePassword globally available
window.togglePassword = togglePassword;

// Also make register function globally available
window.register = register;
window.googleLogin = googleLogin;

// Forgot password handler for login page
document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'forgot-password.html';
});

// Forgot password page functionality
document.getElementById('resetPasswordBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('reset-email')?.value;
  const errorElement = document.getElementById('email-error');
  const successElement = document.getElementById('success-message');
  const resetBtn = document.getElementById('resetPasswordBtn');
  
  if (!email) {
    if (errorElement) {
      errorElement.textContent = 'Please enter your email address';
      errorElement.style.display = 'block';
    }
    return;
  }
  
  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    if (errorElement) {
      errorElement.textContent = 'Please enter a valid email address';
      errorElement.style.display = 'block';
    }
    return;
  }
  
  // Hide error message
  if (errorElement) errorElement.style.display = 'none';
  
  // Show loading state
  resetBtn.textContent = 'Sending...';
  resetBtn.disabled = true;
  
  try {
    // ✅ Reset with redirect settings
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    
    // Show success message
    if (successElement) {
      successElement.style.display = 'block';
    }
    
    // Hide the form
    document.querySelector('.input-group').style.display = 'none';
    resetBtn.style.display = 'none';
    
  } catch (error) {
    console.error("Password reset error:", error);
    
    // Reset button state
    resetBtn.textContent = 'Send Reset Link';
    resetBtn.disabled = false;
    
    // Show error message
    if (errorElement) {
      errorElement.textContent = error.message || 'Failed to send reset email. Please try again.';
      errorElement.style.display = 'block';
    }
  }
});

// Resend link functionality
document.getElementById('resendLink')?.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Reset the form
  document.querySelector('.input-group').style.display = 'block';
  document.getElementById('resetPasswordBtn').style.display = 'block';
  document.getElementById('success-message').style.display = 'none';
  
  // Reset button state
  const resetBtn = document.getElementById('resetPasswordBtn');
  resetBtn.textContent = 'Send Reset Link';
  resetBtn.disabled = false;
});


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
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  bars.forEach(bar => {
    bar.className = "strength-bar";
  });
  
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


// ---------------- AUTHENTICATION STATE MANAGEMENT ----------------
onAuthStateChanged(auth, async (user) => {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (user) {
    // Reload user to get fresh email verification status
    await user.reload();
    
    if (user.emailVerified) {
      // User is verified - allow access to dashboard
      if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'forgot-password.html') {
        window.location.href = 'dashboard.html';
      }
      
      if (currentPage === 'dashboard.html') {
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
          welcomeMessage.textContent = `Welcome back, ${user.email}!`;
        }
      }
    } else {
      // User is not verified - redirect to login
      if (currentPage === 'dashboard.html') {
        alert('Please verify your email address before accessing the dashboard.');
        await signOut(auth);
        window.location.href = 'login.html';
      }
    }
  } else {
    // No user signed in - redirect to login if on protected page
    if (currentPage === 'dashboard.html') {
      window.location.href = 'login.html';
    }
  }
});

// ---------------- SIGN OUT ----------------
async function signOutUser() {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Sign out error:', error);
    alert('Error signing out. Please try again.');
  }
}
document.getElementById('signOutBtn')?.addEventListener('click', signOutUser);

// Add event listeners for login and register buttons
document.getElementById('loginBtn')?.addEventListener('click', login);
