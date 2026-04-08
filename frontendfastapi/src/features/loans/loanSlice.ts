import { createSlice } from '@reduxjs/toolkit';
import {
    fetchLoans,
    fetchLoan,
    createLoan,
    updateLoan,
    addPayment,
    repayLoan,
    deleteLoan,
} from './loanThunks';
import { LoanSelction } from './loanProps';

interface LoanState {
    loans: LoanSelction[];   // ✅ use LoanSelction[]
    selectedLoan?: LoanSelction;
    loading: boolean;
    error?: string;
}

const initialState: LoanState = {
    loans: [],
    selectedLoan: undefined,
    loading: false,
    error: undefined,
};

const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all loans
            .addCase(fetchLoans.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchLoans.fulfilled, (state, action) => {
                state.loading = false;
                // ✅ normalize payload so id is always string
                state.loans = action.payload.map((loan: any) => ({
                    ...loan,
                    id: loan.id ?? loan.borrower_id, // fallback if id missing
                })) as LoanSelction[];
            })
            .addCase(fetchLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch single loan
            .addCase(fetchLoan.fulfilled, (state, action) => {
                state.selectedLoan = {
                    ...action.payload,
                    id: action.payload.id ?? action.payload.borrower_id,
                } as LoanSelction;
            })

            // Create loan
            .addCase(createLoan.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(createLoan.fulfilled, (state, action) => {
                state.loading = false;
                const newLoan = action.payload.loan;
                state.loans.push(newLoan);
            })
            .addCase(createLoan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update loan
            .addCase(updateLoan.fulfilled, (state, action) => {
                const updated = {
                    ...action.payload.loan,
                    id: action.payload.loan.id ?? action.payload.loan.borrower_id,
                } as LoanSelction;
                const index = state.loans.findIndex((l) => l.id === updated.id);
                if (index !== -1) state.loans[index] = updated;
            })

            // Add payment
            .addCase(addPayment.fulfilled, (state, action) => {
                const updated = {
                    ...action.payload.loan,
                    id: action.payload.loan.id ?? action.payload.loan.borrower_id,
                } as LoanSelction;
                const index = state.loans.findIndex((l) => l.id === updated.id);
                if (index !== -1) state.loans[index] = updated;
            })

            // Repay loan
            .addCase(repayLoan.fulfilled, (state, action) => {
                const updated = {
                    ...action.payload.loan,
                    id: action.payload.loan.id ?? action.payload.loan.borrower_id,
                } as LoanSelction;
                const index = state.loans.findIndex((l) => l.id === updated.id);
                if (index !== -1) state.loans[index] = updated;
            })

            // Delete loan
            .addCase(deleteLoan.fulfilled, (state, action) => {
                state.loading = false;
                state.loans = state.loans.filter((l) => l.id !== action.payload.id);
            })
            .addCase(deleteLoan.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(deleteLoan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default loanSlice.reducer;