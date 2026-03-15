import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api";

interface ResetPasswordState {
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: ResetPasswordState = {
  loading: false,
  message: null,
  error: null,
};

// ✅ Async thunk for reset-password API
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data; // expected { message: "Password reset successful" }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Something went wrong");
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    clearResetPasswordState: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearResetPasswordState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;