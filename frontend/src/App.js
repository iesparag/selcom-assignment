import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Typography,
  Box,
  styled
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { format } from 'date-fns';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3)
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2)
}));

const ErrorText = styled('p')(({ theme }) => ({
  color: theme.palette.error.main,
  margin: theme.spacing(1, 0)
}));

const StatusCell = styled(TableCell)(({ status, theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(0.5),
  textAlign: 'center',
  backgroundColor: 
    status === 'completed' ? '#e6ffe6' :
    status === 'pending' ? '#fff3e6' :
    '#ffe6e6',
  color:
    status === 'completed' ? '#008000' :
    status === 'pending' ? '#cc7700' :
    '#cc0000'
}));

function App() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      let url = 'http://localhost:3000/transactions';
      const params = {};
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        params.startDate = start.toISOString();
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        params.endDate = end.toISOString();
      }

      const response = await axios.get(url, { params });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <StyledContainer>
      <Title variant="h4">
        Wallet System Transactions
      </Title>

      <FiltersContainer>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => {
            setDateError('');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date > today) {
              setDateError('Cannot select future dates');
              return;
            }
            
            if (endDate && date > endDate) {
              setDateError('Start date cannot be after end date');
              return;
            }
            
            setStartDate(date);
          }}
          maxDate={new Date()}
          renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(date) => {
            setDateError('');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date > today) {
              setDateError('Cannot select future dates');
              return;
            }
            
            if (startDate && date < startDate) {
              setDateError('End date cannot be before start date');
              return;
            }
            
            setEndDate(date);
          }}
          maxDate={new Date()}
          renderInput={(params) => <TextField {...params} />}
        />
      </FiltersContainer>
      {dateError && <ErrorText>{dateError}</ErrorText>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>From User</TableCell>
              <TableCell>To User</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{transaction._id}</TableCell>
                <TableCell>{transaction.fromUserId?.name || 'Unknown'}</TableCell>
                <TableCell>{transaction.toUserId?.name || 'Unknown'}</TableCell>
                <TableCell align="right">${transaction.amount}</TableCell>
                <StatusCell status={transaction.status}>
                  {transaction.status}
                </StatusCell>
                <TableCell>
                  {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledContainer>
  );
}

export default App;
