import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";

export interface Product {
    name: string;
    productId: string;
    qty: number;
    rate: number;
    weight: string;
    total?: number
}

export interface Bill {
    billing_id: string;
    billing_person: string;
    mode_of_payment: string;
    date: string;
    products: Product[];
    total?: number;
}

interface BillingState {
    bills: Bill[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    loading: boolean;
}

const initialState: BillingState = {
    bills: [],
    status: "idle",
    error: null,
    loading: false
}

// --- Async Thunks for CRUD ---
export const fetchBills = createAsyncThunk(
    "billing/fetchBills",
    async () => {
        const response = await api.get("/bills");
        return response.data;
    });

export const createBill = createAsyncThunk(
    "billing/createBill",
    async (newBill: Omit<Bill, "billing_id" | "date">
    ) => {
        const response = await api.post<Bill>("/bills", newBill);
        return response.data;
    });

export const updateBill = createAsyncThunk(
    "billing/updateBill",
    async ({ billing_id, updates }: { billing_id: string; updates: Partial<Bill> }) => {
        const response = await api.put<Bill>(`/bills/${billing_id}`, updates);
        return response.data;
    });

export const deleteBill = createAsyncThunk(
    "billing/deleteBill",
    async (billing_id: string) => {
        const response = await api.delete(`/bills/${billing_id}`);
        return response.data;
    });

// --- Slice ---
const billingSlice = createSlice({
    name: "billing",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBills.pending, (state) => {
                state.loading = true
                state.status = "loading"
            })
            .addCase(fetchBills.fulfilled, (state, action: PayloadAction<Bill[]>) => {
                state.loading = false
                state.status = "succeeded"
                state.bills = action.payload
            })
            .addCase(fetchBills.rejected, (state, action) => {
                state.loading = false
                state.status = "failed"
                state.error = action.error.message || "Failed to fetch bills";
            })
            .addCase(createBill.fulfilled, (state, action: PayloadAction<Bill>) => {
                state.bills.push(action.payload)
            })
            // Update
            .addCase(updateBill.fulfilled, (state, action: PayloadAction<Bill>) => {
                const index = state.bills.findIndex((b) => b.billing_id === action.payload.billing_id);
                if (index !== -1) {
                    state.bills[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteBill.fulfilled, (state, action: PayloadAction<string>) => {
                state.bills = state.bills.filter((b) => b.billing_id !== action.payload);
            });
    },
});

export default billingSlice.reducer;

