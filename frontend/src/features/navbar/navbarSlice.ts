// src/features/navbar/navbarSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

interface NavbarState {
  user: {
    email: string;
    role: string;
    created_at?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: NavbarState = {
  user: null,
  loading: false,
  error: null,
};

// ✅ Async thunk to fetch user details, optionally by email
export const fetchUserDetails = createAsyncThunk(
  "navbar/fetchUserDetails",
  async (email: string | undefined, thunkAPI) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        "/auth/user-details",
        email ? { email } : {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch user details"
      );
    }
  }
);


const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = navbarSlice.actions;
export default navbarSlice.reducer;