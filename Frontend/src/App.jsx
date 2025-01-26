import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import Homepage from './Components/Homepage';
import LandingPage from './Components/Landingpage';

// Mock authentication function
const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={isAuthenticated() ? <Homepage /> : <Navigate to="/" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
