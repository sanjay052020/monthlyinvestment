import { createAsyncThunk } from '@reduxjs/toolkit';
import { Loan, LoanSelction, Payment } from './loanProps';
import api from '../../api';

// Fetch all loans
export const fetchLoans = createAsyncThunk<Loan[]>(
  'loan/fetchLoans',
  async () => {
    const res = await api.get("/loans");
    return res.data;
  }
);

// Fetch single loan
export const fetchLoan = createAsyncThunk<Loan, string>(
  'loan/fetchLoan',
  async (id) => {
    const res = await api.get(`/loans/${id}`);
    return res.data;
  }
);

// Create loan

export const createLoan = createAsyncThunk<
  { message: string; loan: LoanSelction }, // return type
  Loan // arg type
>(
  "loan/createLoan",
  async (loan) => {
    const res = await api.post("/loans", loan);

    // If backend returns loan fields at the root, not inside res.data.loan
    const normalized: LoanSelction = {
      ...res.data,
      id: res.data.id ?? res.data.borrower_id, // ensure id is always set
    };

    return {
      message: res.data.message,
      loan: normalized,
    };
  }
);

// Update loan
export const updateLoan = createAsyncThunk<
  { message: string; loan: LoanSelction }, // return type
  { id: string; data: Partial<LoanSelction> } // arg type
>(
  "loan/updateLoan",
  async ({ id, data }) => {
    const res = await api.put(`/loans/${id}`, data);
    return {
      message: res.data.message,
      loan: {
        ...res.data.loan,
        id: res.data.loan.id ?? res.data.loan.borrower_id, // normalize id
      } as LoanSelction,
    };
  }
);



// Add payment
export const addPayment = createAsyncThunk<{ message: string; loan: Loan }, { id: string; payment: Payment }>(
  'loan/addPayment',
  async ({ id, payment }) => {
    const res = await api.post(`/loans/${id}/payments`, payment);
    return res.data;
  }
);

// Repay loan
export const repayLoan = createAsyncThunk<{ message: string; loan: Loan }, string>(
  'loan/repayLoan',
  async (id) => {
    const res = await api.put(`/loans/${id}/repay`);
    return res.data;
  }
);

// Delete loan
export const deleteLoan = createAsyncThunk<
  { message: string; id: string }, // return type
  string // arg type (loan id)
>(
  "loan/deleteLoan",
  async (id) => {
    const res = await api.delete(`/loans/${id}`);

    return {
      message: res.data.message,
      id, // return the id we deleted
    };
  }
);

