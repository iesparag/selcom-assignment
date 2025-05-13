require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const { generateDailyReport } = require('./utils/reportGenerator');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/users', require('./routes/users'));
app.use('/transactions', require('./routes/transactions'));


cron.schedule('0 0 * * *', async () => {
  try {
    await generateDailyReport();
    console.log('Daily report generated successfully');
  } catch (error) {
    console.error('Error generating daily report:', error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
