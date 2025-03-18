import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Routes
import LoginPage from './pages/loginPage';
import Dashboard from './pages/dashboard';
import './App.css';

function App() {
  return (
    <Router>
    <Routes> {/* Use Routes instead of direct Route components */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  </Router>

  );
}

export default App;
