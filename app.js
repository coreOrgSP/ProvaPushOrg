// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDutd98WO0ike3CigItDjWZqEZ3X0ayG4A",
  authDomain: "coreorganizzprova1.firebaseapp.com",
  projectId: "coreorganizzprova1",
  storageBucket: "coreorganizzprova1.appspot.com",
  messagingSenderId: "794854416953",
  appId: "1:794854416953:web:6a0f71198c938b761b63e8",
  measurementId: "G-LT16P689DQ"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);
//const messaging = firebase.messaging();


const apiUrl = "https://script.google.com/macros/s/AKfycbxnUsBZq4eQE9oslyxZcZu2OnefF3boB9xTqbnCHmLoByGgDYz1fWdOGDKS5PxgMtWj/exec";  // Web App URL from Apps Script

// Register service worker and Firebase Cloud Messaging (FCM)
if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registered');
            requestNotificationPermission(registration);
        })
        .catch(error => console.error('Service Worker registration failed:', error));
}

// Ask for notification permission
function requestNotificationPermission(registration) {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            registerDeviceWithFCM(registration);
        } else {
            console.error('Notification permission denied.');
        }
    });
}

// Retrieve FCM token and send it to the backend
function getTokenFCM() {
    getToken(messaging, { vapidKey: 'BIaMUUqISWVpbgO3w0afdLIzWhOCgjVAGRkOGb14bj-_SJV5rqwZXhYG50LnXcCoablPMzofV8tRlD88Z1QoBJo' })  // Your public VAPID key
        .then(token => {
            if (token) {
                console.log('FCM Token:', token);
                sendTokenToBackend(token);  // Send the token to the backend
            } else {
                console.warn('No registration token available.');
            }
        })
        .catch(error => console.error('Error retrieving FCM token:', error));
}

// Send FCM token and name to Google Apps Script
function sendTokenToBackend(token) {
    const name = document.getElementById('name').value;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, token: token })
    })
    .then(response => response.text())
    .then(data => {
        console.log('Device registered successfully:', data);
    })
    .catch(error => console.error('Error registering device:', error));
}

// Handle form submission
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    navigator.serviceWorker.ready.then(registration => {
        registerDeviceWithFCM(registration);
    });
});