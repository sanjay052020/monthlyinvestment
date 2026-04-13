import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import Cookies from "js-cookie";

export interface Investment {
    investment_id?: string;
    amount: number;
    toinvestment: string;
    date: string;
    reason: string;
    status: string;
}


interface InvestmentState {
    data: Investment | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    list: Investment[];
}

// Initial state
const initialState: InvestmentState = {
    data: null,
    list: [],
    loading: false,
    error: null,
    message: null
};

// Async thunk for API call
export const addInvestment = createAsyncThunk<
    { investment: Investment; message: string }, // return type
    Investment,                                  // argument type
    { rejectValue: string }
>(
    "investment/addInvestment",
    async (investmentData, { rejectWithValue }) => {
        try {
            const token = Cookies.get("authToken");
            const response = await api.post("/investments", investmentData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            // ✅ assume backend returns { investment: {...}, message: "Investment added successfully" }
            return {
                investment: response.data,
                message: "Investment added successfully",
            };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to add investment");
        }
    }
);

// ✅ Update Investment
export const updateInvestment = createAsyncThunk<
    { investment: Investment; message: string }, // return type
    Investment,                                  // argument type (must include _id)
    { rejectValue: string }
>(
    "investment/updateInvestment",
    async (investmentData, { rejectWithValue }) => {
        try {
            const token = Cookies.get("token");
            // ✅ remove _id from body
            const { investment_id, ...payload } = investmentData;

            const response = await api.put(`/investments/${investment_id}`, payload, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            // assume backend returns { investment: {...}, message: "Investment updated successfully" }
            return {
                investment: response.data.investment,
                message: response.data.message,
            };
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update investment"
            );
        }
    }
);

// ✅ Thunk for fetching all investments
export const fetchAllInvestments = createAsyncThunk<
    Investment[],
    void,
    { rejectValue: string }
>(
    "investment/fetchAllInvestments",
    async (_, { rejectWithValue }) => {
        try {
            const token = Cookies.get("authToken");
            const response = await api.get("/investments", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            // assume backend returns { investments: [...] }
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch investments");
        }
    }
);

// ✅ Delete Investment
export const deleteInvestment = createAsyncThunk<
  string, // return deleted investment_id
  string, // argument: investment_id
  { rejectValue: string }
>("investment/deleteInvestment", async (investment_id, { rejectWithValue }) => {
  try {
    await api.delete(`/investments/${investment_id}`);
    return investment_id; // return deleted id so we can remove from state
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete investment"
    );
  }
});


// Slice
const addInvestmentSlice = createSlice({
    name: "investment",
    initialState,
    reducers: {
        resetInvestment(state) {
            state.data = null;
            state.error = null;
            state.loading = false;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addInvestment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(addInvestment.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.investment;
                state.message = action.payload.message; // ✅ capture backend message
            })
            .addCase(addInvestment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchAllInvestments
            .addCase(fetchAllInvestments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllInvestments.fulfilled, (state, action: PayloadAction<Investment[]>) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAllInvestments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // deleteInvestment
            .addCase(deleteInvestment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInvestment.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((inv) => inv.investment_id !== action.payload);
                state.message = "Investment deleted successfully";
            })
            .addCase(deleteInvestment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateInvestment
            .addCase(updateInvestment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInvestment.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;

                // ✅ Defensive check: ensure we have an _id
                const updated = action.payload.investment;
                if (updated && updated.investment_id) {
                    state.list = state.list.map((inv) =>
                        inv.investment_id === updated.investment_id ? updated : inv
                    );
                }
            })
            .addCase(updateInvestment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export const { resetInvestment, clearMessage } = addInvestmentSlice.actions;
export default addInvestmentSlice.reducer;