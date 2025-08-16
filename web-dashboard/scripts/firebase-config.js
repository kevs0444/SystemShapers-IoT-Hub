const firebaseConfig = {
  apiKey: "AIzaSyCsjVZk2SRofOnlKQVqe1eB4Nvh3JNmqbY",
  authDomain: "systemshapers-iot-hub.firebaseapp.com",
  projectId: "systemshapers-iot-hub",
  storageBucket: "systemshapers-iot-hub.appspot.com",
  messagingSenderId: "172181849234",
  appId: "1:172181849234:web:641514c5e50f0dcfb6924b",
  measurementId: "G-R0SX3TS6JC"
};

let auth;

function initializeFirebase() {
    try {
        const app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        window.firebaseAuth = auth;
        console.log('Firebase initialized successfully');
        return auth;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        window.notifications?.error('Firebase Error', error.message || 'Could not initialize Firebase.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});