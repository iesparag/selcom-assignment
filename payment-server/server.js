require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.post('/process-payment', async (req, res) => {
  try {
    const { transactionId, fromUserId, toUserId, amount } = req.body;

    const delay = Math.floor(Math.random() * (5000 - 2000 + 1) + 2000);
    await new Promise(resolve => setTimeout(resolve, delay));

    const success = Math.random() < 0.9;
    await axios.post(`${process.env.BACKEND_SERVER_URL}/transactions/payment-callback`, {
      transactionId,
      status: success ? 'completed' : 'failed'
    });

    res.json({ success });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});
