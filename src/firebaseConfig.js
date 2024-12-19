// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
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

// Initialize Firebase Authentication, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export storage
