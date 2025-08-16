class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.monitorAuthState();
        this.setupLogoutButton();
    }

    monitorAuthState() {
        const userStatus = document.getElementById('userStatus');
        const checkAuth = () => {
            if (window.firebaseAuth) {
                window.firebaseAuth.onAuthStateChanged((user) => {
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
            userStatus.innerHTML = `
                <div class="user-details">
                    <span class="user-name">${user.displayName || user.email}</span>
                    <span class="user-status">Signed In</span>
                </div>
            `;
        } else {
            userStatus.innerHTML = `<span class="user-status">Not signed in</span>`;
            window.location.href = 'login.html';
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
        this.setButtonLoading(logoutBtn, true);
        try {
            await window.firebaseAuth.signOut();
            window.notifications.success('Logged Out', 'You have been signed out.');
            setTimeout(() => window.location.href = 'login.html', 1200);
        } catch (error) {
            window.notifications.error('Logout Error', error.message || 'Could not log out.');
        } finally {
            this.setButtonLoading(logoutBtn, false);
        }
    }

    setButtonLoading(button, loading) {
        if (!button) return;
        const span = button.querySelector('span');
        if (loading) {
            button.classList.add('loading');
            if (span) span.textContent = 'Logging out...';
        } else {
            button.classList.remove('loading');
            if (span) span.textContent = 'Logout';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});