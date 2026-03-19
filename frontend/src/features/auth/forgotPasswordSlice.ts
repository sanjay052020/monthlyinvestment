import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

interface ForgotPasswordState {
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: ForgotPasswordState = {
  loading: false,
  message: null,
  error: null,
};

// ✅ Async thunk for forgot-password API
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data; // expected { message: "...", token?: "..." }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Something went wrong");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotPasswordState: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;