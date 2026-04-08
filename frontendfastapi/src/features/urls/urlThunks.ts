// features/urls/urlThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";


export const fetchUrls = createAsyncThunk("urls/fetchAll", async () => {
    const response = await api.get("/urls");
    return response.data;
});

export const createUrl = createAsyncThunk(
    "urls/create",
    async (data: { url: string; comments: string }) => {
        const response = await api.post("/urls", data);
        return response.data;
    }
);

export const updateUrl = createAsyncThunk(
    "urls/update",
    async ({ id, data }: { id: string; data: { url?: string; comments?: string } }) => {
        const response = await api.put(`/urls/${id}`, data);
        return response.data;
    }
);

export const deleteUrl = createAsyncThunk("urls/delete", async (id: string) => {
    await api.delete(`/urls/${id}`);
    return id;
});