const firebaseConfig = {
  apiKey: "AIzaSyCsjVZk2SRofOnlKQVqe1eB4Nvh3JNmqbY",
  authDomain: "systemshapers-iot-hub.firebaseapp.com",
  projectId: "systemshapers-iot-hub",
  storageBucket: "systemshapers-iot-hub.firebasestorage.app",
  messagingSenderId: "172181849234",
  appId: "1:172181849234:web:641514c5e50f0dcfb6924b",
  measurementId: "G-R0SX3TS6JC"
};

// Initialize Firebase (using global imports instead of ES6 modules)
let auth;

// Function to initialize Firebase
function initializeFirebase() {
    try {
        // Initialize Firebase app
        const app = firebase.initializeApp(firebaseConfig);
        
        // Get Auth instance
        auth = firebase.auth();
        
        console.log('Firebase initialized successfully');
        return auth;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        // Show error to user
        if (window.notifications) {
            window.notifications.error('Configuration Error', 'Firebase configuration is incorrect. Please check your settings.');
        }
        return null;
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

// Export auth for other scripts
window.firebaseAuth = auth;
