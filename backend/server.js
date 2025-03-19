const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const accountBalanceRoutes = require('./routes/accountBalances');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Enable JSON body parsing
app.use(cors()); // Allow frontend to access backend

// Connect to MongoDB
connectDB();
app.use('/api', accountBalanceRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
