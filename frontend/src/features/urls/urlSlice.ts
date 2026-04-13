import { createSlice } from "@reduxjs/toolkit";
import { fetchUrls, createUrl, updateUrl, deleteUrl } from "./urlThunks";

interface Url {
  id: string;
  url: string;
  comments?: string;
}

interface UrlState {
  items: Url[];
  loading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  items: [],
  loading: false,
  error: null,
};

const urlSlice = createSlice({
  name: "urls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch URLs";
      })
      // Create
      .addCase(createUrl.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateUrl.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Delete
      .addCase(deleteUrl.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      });
  },
});

export default urlSlice.reducer;