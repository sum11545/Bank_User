import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import "./sumit.css";

const LandingPage = () => {
  const navigate = useNavigate(); 
  const [isNewUser, setIsNewUser] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bank-user.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Login Successful", data);
        localStorage.setItem("token", data.token);
      document.cookie = `Cookie=${data.token}; path=/`;
        navigate('/home'); 
      } else {
        console.error("Login Error", data.error);
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://bank-user.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Registration Successful", data);
        // Redirect to login page or show success message
        setIsNewUser(false); // Optionally reset the form
      } else {
        console.error("Registration Error", data.error);
      }
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <h1 className="title">Bank User Info Portal</h1>
          <button className="contact-button">Contact Us</button>
        </div>
      </header>

      <main className="main-content">
        <motion.div
          className="welcome-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="welcome-title">Welcome to the Bank User Portal</h2>
          <p className="welcome-text">
            Manage your account information, check balances, and explore services
            with ease.
          </p>
        </motion.div>

        <div className="card-grid">
          {!isNewUser ? (
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">Sign In</h3>
                <form className="form" onSubmit={handleLogin}>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="input"
                    name="email"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    name="password"
                    className="input"
                  />
                  <button type="submit" className="form-button">Sign In</button>
                </form>
                <button
                  className="form-button switch-button"
                  onClick={() => setIsNewUser(true)}
                >
                  New User? Sign Up
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              className="new-user-form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="form-title">Create New Account</h3>
              <form className="form" onSubmit={handleRegister}>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="input"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="input"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input"
                />
                <button type="submit" className="form-button">Register</button>
                <button
                  className="form-button cancel-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsNewUser(false);
                  }}
                >
                  Back to Sign In
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Bank User Info Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;