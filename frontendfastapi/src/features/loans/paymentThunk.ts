import { createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from './loanProps';
import api from '../../api';

// Create payment
export const createPayment = createAsyncThunk<{ message: string }, Payment>(
  'loan/createPayment',
  async (id, payment) => {
    debugger
    const res = await api.post(`/loans/${id}/payments`, payment);
    return res.data;
  }
);

export const updatePayment = createAsyncThunk<
  { message: string; loan: any }, // return type
  { loanId: string; paymentId: string; data: Payment } // arg type
>(
  "loan/updatePayment",
  async ({ loanId, paymentId, data }) => {
    const res = await api.put(`/loans/${loanId}/payments/${paymentId}`, data);
    return res.data;
  }
);

export const deletePayment = createAsyncThunk<
  { message: string; loan: any },
  { loanId: string; paymentId: string }
>(
  "loan/deletePayment",
  async ({ loanId, paymentId }) => {
    const res = await api.delete(`/loans/${loanId}/payments/${paymentId}`);
    return res.data;
  }
);

