// Service worker Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB9noXR2BudT0VMELFTvnjthCfTA4pxVgU",
  authDomain: "osteopatheanimalier-50728.firebaseapp.com",
  projectId: "osteopatheanimalier-50728",
  storageBucket: "osteopatheanimalier-50728.firebasestorage.app",
  messagingSenderId: "9417853053",
  appId: "1:9417853053:web:ee7ba42a04e8b6f27cc914",
  measurementId: "G-79QK6LZGNC"
});

const messaging = firebase.messaging();

// Affiche la notification même si l'app est en arrière-plan
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/logo_emmy.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
}); 