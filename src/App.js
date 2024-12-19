import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import StudentDashboard from "./dashboard/StudentDashboard";
import TeacherDashboard from "./dashboard/TeacherDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import Register from "./components/Register";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null); // Stores the logged-in user
  const [role, setRole] = useState(""); // Stores the user's role
  const [userDetails, setUserDetails] = useState(null); // Stores user details from Firestore
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user role and other details from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
          setUserDetails(userDoc.data()); // Store all user details
          console.log(userDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Reset the user state
      setRole(""); // Reset the role state
      setUserDetails(null); // Reset user details
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading) return <div>Loading...</div>; // Show a loading state

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> |{" "}
          {!user && <Link to="/register">Register</Link>} |{" "}
          {!user && <Link to="/login">Login</Link>} |{" "}
          {user && <Link to="/dashboard">Dashboard</Link>} |{" "}
          {user && (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "blue",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          {!user && <Route path="/register" element={<Register />} />}
          {!user && <Route path="/login" element={<Login />} />}

          {/* Protected Routes */}
          {user && role === "student" && (
            <Route path="/dashboard" element={<StudentDashboard />} />
          )}
          {user && role === "teacher" && (
            <Route path="/dashboard" element={<TeacherDashboard />} />
          )}
          {user && role === "admin" && (
            <Route path="/dashboard" element={<AdminDashboard />} />
          )}

          {/* Redirect */}
          {!user && <Route path="*" element={<Navigate to="/login" />} />}
          {user && <Route path="*" element={<Navigate to="/dashboard" />} />}
        </Routes>

        {/* Display User Details */}
        {user && userDetails && (
          <div>
            <h3>User Details</h3>
            <p>
              <strong>Name:</strong> {userDetails.firstName}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
          </div>
        )}
      </div>
    </Router>
  );
};

// Home Component
const Home = () => (
  <div>
    <h1>Welcome to the Student Management System</h1>
    <Login />
  </div>
);

export default App;
