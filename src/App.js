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
import "bootstrap/dist/css/bootstrap.min.css";

import StudentDashboard from "./dashboard/Student/StudentDashboard";
import TeacherDashboard from "./dashboard/Teacher/TeacherDashboard";
import AdminDashboard from "./dashboard/Admin/AdminDashboard";
import AccountsDashboard from "./dashboard/Accounts/AccountsDashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
          setUserDetails(userDoc.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole("");
      setUserDetails(null);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <AuthProvider>
      <Router>
        <div className="container mt-4">
          {/* Navbar */}

          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              Student Management System Test
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                {user ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link">
                        Welcome, {userDetails?.firstName}
                      </span>
                    </li>
                    <li className="nav-item">
                      <button
                        className="btn btn-link nav-link"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                    {user && role === "admin" && (
                      <li className="nav-item">
                        <Link className="nav-link" to="/register">
                          Register
                        </Link>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </nav>
          {/* Navbar */}

          {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                Student Management System
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  {!user && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/login">
                          Login
                        </Link>
                      </li>
                    </>
                  )}
                  {user && role === "admin" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
                        Register
                      </Link>
                    </li>
                  )}
                  {user && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li className="nav-item">
                        <button
                          className="btn btn-link nav-link"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav> */}

          {/* Routes */}
          <div className="container mt-4">
            <Routes>
              {!user && <Route path="/" element={<Home />} />}
              {!user && <Route path="/login" element={<Login />} />}
              {user && role === "student" && (
                <Route path="/dashboard" element={<StudentDashboard />} />
              )}
              {user && role === "teacher" && (
                <Route path="/dashboard" element={<TeacherDashboard />} />
              )}
              {user && role === "admin" && (
                <>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/register" element={<Register />} />
                </>
              )}
              {user && role === "accounts" && (
                <Route path="/dashboard" element={<AccountsDashboard />} />
              )}
              {!user && <Route path="*" element={<Navigate to="/login" />} />}
              {user && (
                <Route path="*" element={<Navigate to="/dashboard" />} />
              )}
            </Routes>
          </div>

          {/* Display User Details */}
          {user && userDetails && (
            <div className="container mt-4">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">User Details</h3>
                  <p className="card-text">
                    <strong>Name:</strong> {userDetails.firstName}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {userDetails.email}
                  </p>
                  <p className="card-text">
                    <strong>Role:</strong> {role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
};

// Home Component
const Home = () => (
  <div className="text-center mt-5">
    <h1>Welcome to the Student Management System</h1>
    <p>Please login or register to continue.</p>
    <Login />
  </div>
);

export default App;
