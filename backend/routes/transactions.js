const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

// Get transactions with optional date filters
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const transactions = await Transaction.find(query)
      .populate('fromUserId')
      .populate('toUserId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Check if users exist
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Check if from user has sufficient balance
    const fromWallet = await Wallet.findById(fromUser.walletId);
    if (!fromWallet || fromWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      fromUserId,
      toUserId,
      amount,
      status: 'pending'
    });
    await transaction.save();

    await axios.post(`${process.env.PAYMENT_SERVER_URL}/process-payment`, {
      transactionId: transaction._id,
      fromUserId,
      toUserId,
      amount
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/payment-callback', async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    // Validate status
    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Find and validate transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if transaction is already processed
    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    transaction.status = status;
    await transaction.save();

    if (status === 'completed') {
      // Find and validate wallets
      const fromWallet = await Wallet.findOne({ userId: transaction.fromUserId });
      const toWallet = await Wallet.findOne({ userId: transaction.toUserId });

      if (!fromWallet || !toWallet) {
        transaction.status = 'failed';
        await transaction.save();
        return res.status(404).json({ error: 'Wallet not found' });
      }

      // Recheck balance
      if (fromWallet.balance < transaction.amount) {
        transaction.status = 'failed';
        await transaction.save();
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      fromWallet.balance -= transaction.amount;
      toWallet.balance += transaction.amount;

      await fromWallet.save();
      await toWallet.save();
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
