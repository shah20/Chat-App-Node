// IMPORT ANGULAR'S SW:
importScripts('ngsw-worker.js')
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': '629511258697'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//     console.log('Received background message ', payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//     };

//     self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });