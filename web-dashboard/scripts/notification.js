// Notification system for user feedback
class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    show(type, title, message, duration = 5000) {
        // Remove existing notifications
        this.clearAll();

        const notification = this.createNotification(type, title, message);
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-hide notification
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }

        this.notifications.push(notification);
        return notification;
    }

    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const iconMap = {
            success: `<svg class="notification-icon" viewBox="0 0 24 24" style="fill: var(--success)">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
            </svg>`,
            error: `<svg class="notification-icon" viewBox="0 0 24 24" style="fill: var(--error)">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1.5,1.5 0 0,0 10.5,8.5A1.5,1.5 0 0,0 12,10A1.5,1.5 0 0,0 13.5,8.5A1.5,1.5 0 0,0 12,7M10.5,12H13.5V17H10.5V12Z"/>
            </svg>`,
            warning: `<svg class="notification-icon" viewBox="0 0 24 24" style="fill: var(--warning)">
                <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>`,
            info: `<svg class="notification-icon" viewBox="0 0 24 24" style="fill: var(--accent-primary)">
                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>`
        };

        notification.innerHTML = `
            ${iconMap[type] || iconMap.info}
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
            </button>
        `;

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(notification));

        return notification;
    }

    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clearAll() {
        this.notifications.forEach(notification => this.hide(notification));
    }

    // Convenience methods
    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }

    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }

    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }

    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }
}

// Create global notification manager instance
window.notifications = new NotificationManager();

// Helper function for Firebase error messages
window.getFirebaseErrorMessage = function(errorCode) {
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
        message: 'An unexpected error occurred. Please try again later.'
    };
};