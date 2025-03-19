const express = require('express');
const router = express.Router();
const AccountBalance = require('../models/accountBalance');

// Endpoint to log account balance to the database
router.post('/logBalance', async (req, res) => {
  const { balance } = req.body; // Expecting only `balance` in the request body

  if (!balance) {
    // If no balance is provided, return an error response
    return res.status(400).json({ message: 'Balance is required' });
  }

  try {
    // Log the data in the database with Mongoose's automatic `createdAt`
    const newBalance = new AccountBalance({
      balance, // Only pass the balance, timestamp is handled automatically by Mongoose
    });

    await newBalance.save(); // Save the data to the database

    return res.status(200).json({ message: 'Balance logged successfully' });
  } catch (err) {
    console.error('Error saving balance data:', err);
    return res.status(500).json({ message: 'Error saving balance' });
  }
});
router.get('/getBalances', async (req, res) => {
  try {
    const balances = await AccountBalance.find().sort({ createdAt: 1 }); // Sort by time (oldest first)
    res.status(200).json(balances);
  } catch (err) {
    console.error('Error fetching balance data:', err);
    res.status(500).json({ message: 'Error retrieving balance data' });
  }
});


module.exports = router;
