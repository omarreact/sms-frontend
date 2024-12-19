// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUAzIwvK5maPDGb0ueUpCPrEADCBQ1DNo",
  authDomain: "student-management-syste-82f29.firebaseapp.com",
  projectId: "student-management-syste-82f29",
  storageBucket: "student-management-syste-82f29.firebasestorage.app",
  messagingSenderId: "901870118888",
  appId: "1:901870118888:web:54664950f9f3198e4b265d",
  measurementId: "G-SSLGQPKC45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage
