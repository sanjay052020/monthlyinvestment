import { createAsyncThunk } from '@reduxjs/toolkit';
import { Payment } from './loanProps';
import api from '../../api';

interface AddPaymentProps {
  date: string;
  amount: number;
  source: string;
}


// Create payment
export const createPayment = createAsyncThunk<
  Payment, // return type is Payment
  { loanId: string; payment: AddPaymentProps } // argument type
>(
  "loan/createPayment",
  async ({ loanId, payment }) => {
    const res = await api.post(`/loans/${loanId}/payments`, payment);
    return res.data as Payment; // assume API returns the created payment
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

