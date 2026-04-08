import { createSlice } from '@reduxjs/toolkit';
import { createPayment } from './paymentThunk';
import { Payment } from './loanProps';

interface PaymentState {
  payments: Payment[];
  loading: boolean;
  error?: string;
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: undefined,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })

      // Fulfilled
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.meta.arg); // use payload returned from thunk
      })

      // Rejected
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default paymentSlice.reducer;
