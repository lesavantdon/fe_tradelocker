const mongoose = require('mongoose');

const accountBalanceSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true, // Ensures the balance is always provided
  }
}, { timestamps: true }); // Mongoose will automatically handle `createdAt` and `updatedAt`

const AccountBalance = mongoose.model('AccountBalance', accountBalanceSchema, 'cashbalance');

module.exports = AccountBalance;
