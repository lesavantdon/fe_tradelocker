import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2'; // Using Chart.js for the line chart
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [accountBalanceData, setAccountBalanceData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch account balance data at intervals
  useEffect(() => {
    const fetchAccountState = async () => {
      const token = localStorage.getItem('authToken'); // Get the user's token
      const accountId = '506678'; // Replace with your actual accountId

      if (!token) {
        console.error('User not authenticated');
        return;
      }

      try {
        const response = await axios.get(`https://live.tradelocker.com/backend-api/trade/accounts/${accountId}/state`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accNum: '2' // Include accNum header if needed
          }
        });

        const balance = response.data.d.accountDetailsData[0]; // Assume the first value is the balance
        const timestamp = new Date().toISOString(); // Current timestamp

        // Update state with the new balance and timestamp
        setAccountBalanceData((prevData) => [...prevData, balance]);
        setTimestamps((prevTimestamps) => [...prevTimestamps, timestamp]);

      } catch (err) {
        console.error('Error fetching account balance:', err);
      }
    };

    // Fetch balance every minute (60000ms)
    const interval = setInterval(fetchAccountState, 60000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  // Prepare data for the chart
  const chartData = {
    labels: timestamps, // Timestamps for the x-axis
    datasets: [
      {
        label: 'Account Balance',
        data: accountBalanceData, // Account balance for the y-axis
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h1>Equity Curve</h1>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default Dashboard;
