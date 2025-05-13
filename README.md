# Wallet System

A mini wallet system with separate backend and payment processing servers.

## Project Structure

```
wallet-system/
├── backend/         # Main backend server
├── payment-server/  # Payment processing server
└── frontend/        # React frontend
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

### Backend Server

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file with:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_uri
   PAYMENT_SERVER_URL=http://localhost:3001
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

### Payment Server

1. Navigate to payment-server directory:
   ```bash
   cd payment-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file with:
   ```
   PORT=3001
   BACKEND_SERVER_URL=http://localhost:3000
   ```

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## API Endpoints

### Users API

1. Create User
   ```
   POST /users
   Body: {
     "name": "User Name",
     "email": "user@example.com"
   }
   ```

2. Get User
   ```
   GET /users/:userId
   ```

### Transactions API

1. Create Transaction
   ```
   POST /transactions
   Body: {
     "fromUserId": "user1_id",
     "toUserId": "user2_id",
     "amount": 100
   }
   ```

2. Get Transactions (with optional date filters)
   ```
   GET /transactions
   Query Parameters:
   - startDate (optional): YYYY-MM-DD
   - endDate (optional): YYYY-MM-DD
   ```

### Payment Processing

1. Process Payment
   ```
   POST /process-payment
   Body: {
     "transactionId": "transaction_id",
     "fromUserId": "user1_id",
     "toUserId": "user2_id",
     "amount": 100
   }
   ```

2. Payment Callback
   ```
   POST /transactions/payment-callback
   Body: {
     "transactionId": "transaction_id",
     "status": "completed" | "failed"
   }
   ```

## Features

1. **User Management**
   - Create user with auto wallet creation (initial balance: ₹100)
   - Get user details with wallet information

2. **Transaction Processing**
   - Create transaction between users
   - Asynchronous payment processing
   - Automatic wallet balance updates
   - Transaction status tracking (pending/completed/failed)

3. **Daily Reports**
   - Automatic daily transaction report generation
   - Report sent via email at midnight
   - Excel format with transaction details

4. **Frontend Features**
   - View all transactions
   - Filter transactions by date range
   - Color-coded transaction status

## Postman Collection

Import the `Wallet-System.postman_collection.json` file into Postman to test the APIs. The collection includes:

1. Backend Server Requests
   - Create User
   - Get User
   - Create Transaction
   - Get Transactions

2. Payment Server Requests
   - Process Payment
   - Payment Callback

## Running the System

1. Start MongoDB server

2. Start Backend Server:
   ```bash
   cd backend && npm run dev
   ```

3. Start Payment Server:
   ```bash
   cd payment-server && npm run dev
   ```

4. Start Frontend (optional):
   ```bash
   cd frontend && npm start
   ```

The system will be available at:
- Backend: http://localhost:3000
- Payment Server: http://localhost:3001
- Frontend: http://localhost:3002
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/wallet-system
   PAYMENT_SERVER_URL=http://localhost:3001
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Payment Server

1. Navigate to payment-server directory:
   ```bash
   cd payment-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file with:
   ```
   PORT=3001
   BACKEND_SERVER_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation

### Backend Server APIs

1. Create User
   - POST /users
   - Body: { "name": "string", "email": "string" }

2. Get User
   - GET /users/:id

3. Create Transaction
   - POST /transactions
   - Body: { "fromUserId": "string", "toUserId": "string", "amount": number }

4. Payment Callback
   - POST /payment-callback
   - Body: { "transactionId": "string", "status": "completed" | "failed" }

### Payment Server APIs

1. Process Payment
   - POST /process-payment
   - Body: { "transactionId": "string", "fromUserId": "string", "toUserId": "string", "amount": number }

## Features

- User management with automatic wallet creation
- Transaction processing with simulated delay
- Daily transaction report generation (cron job)
- Email notifications with Excel reports
- Balance validation and updates
