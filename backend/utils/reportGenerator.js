const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const Transaction = require('../models/Transaction');

const generateDailyReport = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      createdAt: {
        $gte: yesterday,
        $lt: today
      }
    }).populate('fromUserId toUserId');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Transactions');

    worksheet.columns = [
      { header: 'Transaction ID', key: 'id' },
      { header: 'From User', key: 'fromUser' },
      { header: 'To User', key: 'toUser' },
      { header: 'Amount', key: 'amount' },
      { header: 'Status', key: 'status' },
      { header: 'Created At', key: 'createdAt' }
    ];

    transactions.forEach(transaction => {
      worksheet.addRow({
        id: transaction._id.toString(),
        fromUser: transaction.fromUserId.name,
        toUser: transaction.toUserId.name,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.createdAt
      });
    });

    // Save to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: `Daily Transaction Report - ${yesterday.toISOString().split('T')[0]}`,
      text: 'Please find attached the daily transaction report.',
      attachments: [
        {
          filename: `transactions-${yesterday.toISOString().split('T')[0]}.xlsx`,
          content: buffer
        }
      ]
    });
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

module.exports = { generateDailyReport };
