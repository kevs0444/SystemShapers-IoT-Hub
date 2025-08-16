class AuthManager {
    constructor() {
        this.auth = null;
        this.init();
    }

    init() {
        const checkFirebaseInit = setInterval(() => {
            if (window.firebaseAuth) {
                clearInterval(checkFirebaseInit);
                this.auth = window.firebaseAuth;
                this.setupAuthManager();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(checkFirebaseInit);
            if (!this.auth) {
                window.notifications.error('Firebase Error', 'Could not initialize Firebase.');
            }
        }, 10000);
    }

    setupAuthManager() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html')) {
            this.initLoginPage();
            this.initForgotPassword();
        } else if (currentPage.includes('register.html')) {
            this.initRegisterPage();
        }
        this.monitorAuthState();
    }

    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        const googleBtn = document.getElementById('googleSignInBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }
    }

    initRegisterPage() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        const googleBtn = document.getElementById('googleSignInBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }
    }

    initForgotPassword() {
        const forgotLink = document.getElementById('forgotPasswordLink');
        const resetModal = document.getElementById('resetModal');
        const resetForm = document.getElementById('resetForm');
        if (forgotLink && resetModal) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                resetModal.style.display = 'block';
            });
        }
        if (resetForm) {
            resetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        if (!email || !password) {
            window.notifications.error('Missing Fields', 'Please enter both email and password.');
            return;
        }
        if (!this.isValidEmail(email)) {
            window.notifications.error('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        this.setButtonLoading(loginBtn, true);
        try {
            await this.auth.signInWithEmailAndPassword(email, password);
            window.notifications.success('Login Successful', 'Redirecting to dashboard...');
            setTimeout(() => window.location.href = 'index.html', 1200);
        } catch (error) {
            const errorInfo = this.getFirebaseErrorMessage(error.code);
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
        if (!email || !password) {
            window.notifications.error('Missing Fields', 'Please enter both email and password.');
            return;
        }
        if (!this.isValidEmail(email)) {
            window.notifications.error('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            window.notifications.error('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        this.setButtonLoading(registerBtn, true);
        try {
            await this.auth.createUserWithEmailAndPassword(email, password);
            window.notifications.success('Registration Successful', 'Redirecting to dashboard...');
            setTimeout(() => window.location.href = 'index.html', 1200);
        } catch (error) {
            const errorInfo = this.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(registerBtn, false);
        }
    }

    async handleGoogleSignIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await this.auth.signInWithPopup(provider);
            window.notifications.success('Google Sign-In Successful', 'Welcome! Redirecting to dashboard...');
            setTimeout(() => window.location.href = 'index.html', 1200);
        } catch (error) {
            const errorInfo = this.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        }
    }

    async handlePasswordReset(event) {
        event.preventDefault();
        const email = document.getElementById('resetEmail').value.trim();
        const resetBtn = document.getElementById('resetBtn');
        if (!email) {
            window.notifications.error('Missing Email', 'Please enter your email address.');
            return;
        }
        this.setButtonLoading(resetBtn, true);
        try {
            await this.auth.sendPasswordResetEmail(email);
            window.notifications.success('Reset Email Sent', 'Check your email for a password reset link.');
            document.getElementById('resetModal').style.display = 'none';
        } catch (error) {
            const errorInfo = this.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(resetBtn, false);
        }
    }

    monitorAuthState() {
        if (!this.auth) return;
        this.auth.onAuthStateChanged((user) => {
            if (window.location.pathname.includes('index.html')) {
                if (!user) {
                    window.location.href = 'login.html';
                }
            }
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setButtonLoading(button, loading) {
        if (!button) return;
        const span = button.querySelector('span');
        if (loading) {
            button.classList.add('loading');
            if (span) span.textContent = 'Loading...';
        } else {
            button.classList.remove('loading');
            if (span) span.textContent = button.id === 'loginBtn' ? 'Sign In to Dashboard' :
                button.id === 'registerBtn' ? 'Create Account' :
                button.id === 'resetBtn' ? 'Send Reset Link' :
                button.id === 'googleSignInBtn' ? (window.location.pathname.includes('register') ? 'Sign up with Google' : 'Sign in with Google') :
                'Submit';
        }
    }

    getFirebaseErrorMessage(errorCode) {
        const errors = {
            'auth/user-not-found': { title: 'User Not Found', message: 'No account found with this email.' },
            'auth/wrong-password': { title: 'Incorrect Password', message: 'The password is incorrect.' },
            'auth/email-already-in-use': { title: 'Email In Use', message: 'This email is already registered.' },
            'auth/invalid-email': { title: 'Invalid Email', message: 'Please enter a valid email address.' },
            'auth/weak-password': { title: 'Weak Password', message: 'Password must be at least 6 characters.' },
            'auth/popup-closed-by-user': { title: 'Popup Closed', message: 'Google sign-in was cancelled.' },
            'auth/network-request-failed': { title: 'Network Error', message: 'Check your internet connection.' },
            'default': { title: 'Authentication Error', message: 'An error occurred. Please try again.' }
        };
        return errors[errorCode] || errors['default'];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});