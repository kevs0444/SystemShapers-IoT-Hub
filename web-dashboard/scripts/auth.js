// Authentication logic using Firebase compat SDK
class AuthManager {
    constructor() {
        this.auth = null;
        this.init();
    }

    init() {
        // Wait for Firebase to be initialized
        const checkFirebaseInit = setInterval(() => {
            if (window.firebase && firebase.auth) {
                this.auth = firebase.auth();
                clearInterval(checkFirebaseInit);
                this.setupAuthManager();
            }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkFirebaseInit);
            if (!this.auth) {
                console.error('Firebase failed to initialize');
                if (window.notifications) {
                    window.notifications.error('Initialization Error', 'Failed to connect to authentication service. Please refresh and try again.');
                }
            }
        }, 10000);
    }

    setupAuthManager() {
        console.log('Setting up auth manager...');
        
        // Check which page we're on and initialize accordingly
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('login.html') || currentPage === '/' || currentPage === '/login.html') {
            this.initLoginPage();
        } else if (currentPage.includes('register.html')) {
            this.initRegisterPage();
        }

        // Monitor auth state changes
        this.monitorAuthState();
    }

    initLoginPage() {
        console.log('Initializing login page...');
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    initRegisterPage() {
        console.log('Initializing register page...');
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        console.log('Login attempt started...');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        console.log('Login credentials:', { email: email, passwordLength: password.length });

        // Validate inputs
        if (!email || !password) {
            window.notifications.error('Missing Information', 'Please fill in all fields.');
            return;
        }

        if (!this.isValidEmail(email)) {
            window.notifications.error('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        // Show loading state
        this.setButtonLoading(loginBtn, true);

        try {
            console.log('Attempting Firebase sign in...');
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('Login successful:', user.uid);
            
            window.notifications.success(
                'Login Successful', 
                `Welcome back, ${user.email}! Redirecting to dashboard...`
            );

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            const errorInfo = this.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        console.log('Registration attempt started...');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const registerBtn = document.getElementById('registerBtn');

        // Validate inputs
        if (!email || !password) {
            window.notifications.error('Missing Information', 'Please fill in all fields.');
            return;
        }

        if (!this.isValidEmail(email)) {
            window.notifications.error('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            window.notifications.error('Password Too Short', 'Password must be at least 6 characters long.');
            return;
        }

        // Show loading state
        this.setButtonLoading(registerBtn, true);

        try {
            console.log('Attempting Firebase registration...');
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('Registration successful:', user.uid);
            
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
            const errorInfo = this.getFirebaseErrorMessage(error.code);
            window.notifications.error(errorInfo.title, errorInfo.message);
        } finally {
            this.setButtonLoading(registerBtn, false);
        }
    }

    monitorAuthState() {
        if (!this.auth) return;

        this.auth.onAuthStateChanged((user) => {
            const currentPage = window.location.pathname;
            console.log('Auth state changed:', { user: user ? user.email : null, currentPage });
            
            if (user) {
                // User is signed in
                console.log('User is authenticated:', user.email);
                if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
                    console.log('Redirecting to dashboard...');
                    // If on auth pages, redirect to dashboard
                    window.location.href = 'index.html';
                }
            } else {
                // User is signed out
                console.log('User is not authenticated');
                if (currentPage.includes('index.html') || currentPage === '/' || currentPage === '') {
                    console.log('Redirecting to login...');
                    // If on dashboard, redirect to login
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

    getFirebaseErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': {
                title: 'User Not Found',
                message: 'No account found with this email address. Please check your email or create a new account.'
            },
            'auth/wrong-password': {
                title: 'Invalid Password',
                message: 'The password you entered is incorrect. Please try again or reset your password.'
            },
            'auth/invalid-email': {
                title: 'Invalid Email',
                message: 'Please enter a valid email address.'
            },
            'auth/user-disabled': {
                title: 'Account Disabled',
                message: 'This account has been disabled. Please contact support for assistance.'
            },
            'auth/email-already-in-use': {
                title: 'Email Already Registered',
                message: 'An account with this email already exists. Please sign in or use a different email.'
            },
            'auth/weak-password': {
                title: 'Weak Password',
                message: 'Password should be at least 6 characters long and contain a mix of letters and numbers.'
            },
            'auth/operation-not-allowed': {
                title: 'Operation Not Allowed',
                message: 'Email/password accounts are not enabled. Please contact support.'
            },
            'auth/invalid-credential': {
                title: 'Invalid Credentials',
                message: 'The email or password you entered is incorrect. Please check and try again.'
            },
            'auth/too-many-requests': {
                title: 'Too Many Attempts',
                message: 'Too many failed login attempts. Please try again later or reset your password.'
            },
            'auth/network-request-failed': {
                title: 'Network Error',
                message: 'Unable to connect to our servers. Please check your internet connection and try again.'
            },
            'auth/popup-closed-by-user': {
                title: 'Sign-in Cancelled',
                message: 'The sign-in process was cancelled. Please try again.'
            }
        };

        return errorMessages[errorCode] || {
            title: 'Authentication Error',
            message: `An unexpected error occurred: ${errorCode}. Please try again later.`
        };
    }

    // ...existing code...
setupAuthManager() {
    // ...existing code...
    if (currentPage.includes('login.html') || currentPage === '/' || currentPage === '/login.html') {
        this.initLoginPage();
        this.initForgotPassword(); // <-- add this
    }
    // ...existing code...
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
// ...existing code...
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AuthManager...');
    new AuthManager();
});