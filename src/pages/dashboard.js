
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [accountBalanceData, setAccountBalanceData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const previousBalance = useRef(null); // Stores last known balance to avoid duplicate updates

  useEffect(() => {
    const fetchStoredBalances = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getBalances');
        const fetchedData = response.data;

        if (fetchedData.length > 0) {
          const formattedTimestamps = fetchedData.map(entry =>
            new Date(entry.createdAt).toLocaleString('en-CA', { timeZone: 'UTC' })
          );

          const balances = fetchedData.map(entry => entry.balance);
          
          setAccountBalanceData(balances);
          setTimestamps(formattedTimestamps);
          previousBalance.current = balances[balances.length - 1]; // Set last known balance
        }
      } catch (error) {
        console.error('Error fetching stored balances:', error);
      }
    };

    fetchStoredBalances();
  }, []);

  useEffect(() => {
    const fetchAccountState = async () => {
      const token = localStorage.getItem('authToken');
      const accountId = '506678'; // Replace with the actual accountId you want to track

      if (!token) {
        console.error('User not authenticated');
        return;
      }

      try {
        const realTimeResponse = await axios.get(
          `https://live.tradelocker.com/backend-api/trade/accounts/${accountId}/state`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accNum: '2',
            },
          }
        );

        console.log('Real-time data fetched:', realTimeResponse.data);
        const balance = realTimeResponse.data.d.accountDetailsData[0]; // Extract balance

        if (balance !== previousBalance.current) {
          const currentTimestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });


          setAccountBalanceData((prevData) => [...prevData, balance]);
          setTimestamps((prevTimestamps) => [...prevTimestamps, currentTimestamp]);

          await axios.post('http://localhost:5000/api/logBalance', { balance });

          console.log('New balance logged:', balance);
          previousBalance.current = balance; // Update reference
        }
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchAccountState(); // Initial fetch on component mount

    const interval = setInterval(fetchAccountState, 10800000); // Fetch every 3 hours (10,800,000 ms)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <h1 style = {{textAlign: 'center', 
  textDecoration: 'underline', 
  fontFamily: 'cursive', 
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#4A90E2' }}>Equity Curve</h1>
      <Line
        data={{
          labels: timestamps,
          datasets: [
            {
              label: 'Account Balance Over Time',
              data: accountBalanceData,
              borderColor: 'rgb(75, 180, 192)',
              backgroundColor: 'rgba(0, 4, 4, 0.2)',
              fill: false,
              tension: 0.1,
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  );
};

export default Dashboard;
