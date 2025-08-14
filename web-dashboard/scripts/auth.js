// Authentication logic for login and register pages
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from './firebase-config.js';

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Check which page we're on and initialize accordingly
        if (window.location.pathname.includes('login.html') || window.location.pathname === '/') {
            this.initLoginPage();
        } else if (window.location.pathname.includes('register.html')) {
            this.initRegisterPage();
        }

        // Monitor auth state changes
        this.monitorAuthState();
    }

    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    initRegisterPage() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        // Validate inputs
        if (!email || !password) {
            window.notifications.error('Missing Information', 'Please fill in all fields.');
            return;
        }

        // Show loading state
        this.setButtonLoading(loginBtn, true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            window.notifications.success(
                'Login Successful', 
                `Welcome back! Redirecting to dashboard...`
            );

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            const errorInfo = window.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const registerBtn = document.getElementById('registerBtn');

        // Validate inputs
        if (!email || !password) {
            window.notifications.error('Missing Information', 'Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            window.notifications.error('Password Too Short', 'Password must be at least 6 characters long.');
            return;
        }

        // Show loading state
        this.setButtonLoading(registerBtn, true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            window.notifications.success(
                'Account Created Successfully', 
                'Welcome to SystemShapers! Redirecting to dashboard...'
            );

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Registration error:', error);
            const errorInfo = window.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(registerBtn, false);
        }
    }

    monitorAuthState() {
        onAuthStateChanged(auth, (user) => {
            const currentPage = window.location.pathname;
            
            if (user) {
                // User is signed in
                if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
                    // If on auth pages, redirect to dashboard
                    window.location.href = 'index.html';
                }
            } else {
                // User is signed out
                if (currentPage.includes('index.html') || currentPage === '/') {
                    // If on dashboard, redirect to login
                    window.location.href = 'login.html';
                }
            }
        });
    }

    setButtonLoading(button, loading) {
        if (!button) return;

        const span = button.querySelector('span');
        const svg = button.querySelector('svg');

        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            
            if (span) span.textContent = 'Please wait...';
            if (svg) {
                svg.style.display = 'none';
                // Add spinner
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                button.appendChild(spinner);
            }
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            
            // Remove spinner
            const spinner = button.querySelector('.spinner');
            if (spinner) spinner.remove();
            
            // Restore original content
            if (span) {
                if (button.id === 'loginBtn') {
                    span.textContent = 'Sign In to Dashboard';
                } else if (button.id === 'registerBtn') {
                    span.textContent = 'Create Account';
                }
            }
            if (svg) svg.style.display = 'block';
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});