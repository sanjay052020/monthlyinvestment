// src/features/auth/registrationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

interface RegistrationState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: RegistrationState = {
  success: false,
  loading: false,
  error: null,
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (newUser: { email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", newUser);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default registrationSlice.reducer;