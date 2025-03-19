import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import DashboardPage from './pages/dashboard'; // Assuming you have a dashboard page

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={() => console.log('User logged in')} />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};

export default App;
