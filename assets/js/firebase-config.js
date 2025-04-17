// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnZTMNMKkk66-iKqBybmw6cWSCrsLgO9g",
    authDomain: "perpustakaan-86237.firebaseapp.com",
    databaseURL: "https://perpustakaan-86237-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "perpustakaan-86237",
    storageBucket: "perpustakaan-86237.firebasestorage.app",
    messagingSenderId: "841568966902",
    appId: "1:841568966902:web:5139f824dbdcc1ab6634d7"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Check authentication state
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      // Check if user is on auth page and redirect to dashboard if so
      const currentPath = window.location.pathname;
      if (currentPath.includes('/auth/')) {
        window.location.href = 'index.html';
      }
    } else {
      // User is signed out
      // Check if user is trying to access restricted pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/auth/') && !currentPath.includes('/index.html')) {
        window.location.href = '/pages/auth/login.html';
      }
    }
  });