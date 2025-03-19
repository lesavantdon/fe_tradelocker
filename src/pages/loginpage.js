import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';  // Import the CSS file

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  const handleLoginAccount1 = async () => {
    try {
      const response = await axios.post('https://live.tradelocker.com/backend-api/auth/jwt/token', {
        email: "sahotaaneet@gmail.com",
        password: "1Icecream2$",
        server: "athens"
      });
  
      console.log("Full Response:", response); // Log the full response for debugging
  
      // Use accessToken from the response
      const { accessToken } = response.data;
  
      if (accessToken) {
        console.log("Bearer Token:", accessToken); // Log the accessToken
        localStorage.setItem('authToken', accessToken); // Store the token in localStorage
        onLogin(); // Trigger the login state change
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        setError('No access token returned from the server');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid login credentials');
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Athens</h2>

        {/* Login Button for Account 1 */}
        <button onClick={handleLoginAccount1}>Login</button>

        {/* Error Message */}
        {error && <p role="alert">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
