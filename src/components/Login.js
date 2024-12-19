import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";

const Login = () => {
  const [emailOrId, setEmailOrId] = useState(""); // This will accept either email or ID number
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let userCredential;

      // Check if input is an email or ID number
      if (emailOrId.includes("@")) {
        // If the input is an email, sign in with email and password
        userCredential = await signInWithEmailAndPassword(
          auth,
          emailOrId,
          password
        );
      } else {
        // If the input is not an email, assume it's an ID number
        // Query Firestore to find the user by ID number
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("idNumber", "==", emailOrId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            password
          );
        } else {
          throw new Error("User with this ID number not found.");
        }
      }

      // After login, get the user role from Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        // Navigate based on the user role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userRole === "student") {
          navigate("/student-dashboard");
        } else if (userRole === "accounts") {
          navigate("/accounts-dashboard");
        } else {
          navigate("/general-dashboard"); // Default route
        }
      } else {
        setError("User role not found!");
      }
    } catch (err) {
      setError(err.message || "Invalid email/ID number or password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="emailOrId" className="form-label">
                    Email or ID Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emailOrId"
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
              {/* Optional: Add Forgot Password link */}
              {/* <div className="text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
