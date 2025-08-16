class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(type, title, message, duration = 5000) {
        const notification = this.createNotification(type, title, message);
        this.container.appendChild(notification);
        setTimeout(() => this.hide(notification), duration);
    }

    createNotification(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <strong>${title}</strong>
            <p>${message}</p>
        `;
        notification.addEventListener('click', () => this.hide(notification));
        return notification;
    }

    hide(notification) {
        if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }

    clearAll() {
        this.container.innerHTML = '';
    }

    success(title, message, duration) {
        this.show('success', title, message, duration);
    }

    error(title, message, duration) {
        this.show('error', title, message, duration);
    }

    warning(title, message, duration) {
        this.show('warning', title, message, duration);
    }

    info(title, message, duration) {
        this.show('info', title, message, duration);
    }
}

window.notifications = new NotificationManager();