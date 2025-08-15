// Dashboard page logic
// Using global Firebase objects instead of ES6 imports

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        // Monitor authentication state
        this.monitorAuthState();
        
        // Setup logout button
        this.setupLogoutButton();
    }

    monitorAuthState() {
        const userStatus = document.getElementById('userStatus');
        
        // Wait for Firebase to be initialized
        const checkAuth = () => {
            if (window.firebaseAuth) {
                firebase.auth().onAuthStateChanged((user) => {
                    this.handleAuthStateChange(user, userStatus);
                });
            } else {
                setTimeout(checkAuth, 100);
            }
        };
        checkAuth();
    }

    handleAuthStateChange(user, userStatus) {
        if (user) {
            // User is signed in
            const email = user.email;
            const displayName = user.displayName || email.split('@')[0];
            
            // Update user info in header
            const userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = displayName;
            }
            
            if (userStatus) {
                userStatus.textContent = email;
            }

            // Show success notification on first load
            if (!sessionStorage.getItem('dashboardLoaded')) {
                sessionStorage.setItem('dashboardLoaded', 'true');
                window.notifications.success(
                    'Welcome to SystemShapers!', 
                    `Hello ${displayName}, you're successfully logged in.`
                );
            }

        } else {
            // User is signed out, redirect to login
            if (userStatus) {
                userStatus.textContent = "Redirecting to login...";
            }
            
            window.notifications.info(
                'Session Expired', 
                'Please sign in to access your dashboard.'
            );

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Show loading state
        this.setButtonLoading(logoutBtn, true);

        try {
            await firebase.auth().signOut();
            
            // Clear session data
            sessionStorage.clear();
            
            window.notifications.success(
                'Logged Out Successfully', 
                'Thank you for using SystemShapers. Redirecting...'
            );

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (error) {
            console.error('Logout error:', error);
            window.notifications.error(
                'Logout Failed', 
                'An error occurred while signing out. Please try again.'
            );
        } finally {
            this.setButtonLoading(logoutBtn, false);
        }
    }

    setButtonLoading(button, loading) {
        if (!button) return;

        const span = button.querySelector('span');
        const svg = button.querySelector('svg');

        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            
            if (span) span.textContent = 'Signing out...';
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
            if (span) span.textContent = 'Sign Out';
            if (svg) svg.style.display = 'block';
        }
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});
