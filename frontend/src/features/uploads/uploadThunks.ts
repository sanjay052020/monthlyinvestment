import { createAsyncThunk } from '@reduxjs/toolkit';
import { UploadPayload, UploadProps } from './uploadsTypes';
import api from '../../api';

// Fetch all uploads
export const fetchUploads = createAsyncThunk<UploadProps[], void>(
  'uploads/fetchUploads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UploadProps[]>('/files/all');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Save a new upload (no id required)
export const saveUpload = createAsyncThunk<UploadProps, UploadPayload>(
  'uploads/saveUpload',
  async ({ name, comments, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('comments', comments);
      formData.append('file', file);

      const response = await api.post<UploadProps>('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data; // backend returns UploadResponse with id + file_id
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update an existing upload (PUT by id)
export const updateUpload = createAsyncThunk<
  UploadProps,
  { id: string; file_id: string; name: string; comments: string; file: File | null }
>(
  "uploads/updateUpload",
  async ({ id, file_id, name, comments, file }, { rejectWithValue }) => {
    try {
      if (!id) throw new Error("Upload id is required for update");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("comments", comments);
      if (file) {
        formData.append("file", file); // ✅ required field
      }

      const response = await api.put<UploadProps>(
        `/files/update/${file_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// Delete an upload (DELETE by id)
export const deleteUpload = createAsyncThunk<string, string>(
  'uploads/deleteUpload',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/files/delete/app/${id}`);
      return id; // return deleted id so we can remove from state
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Download a file by id
export const downloadFiles = createAsyncThunk<void, string>(
  'uploads/downloadUpload',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/files/download/${id}`, {
        responseType: 'blob', // important for binary data
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: response.data.type || response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `file-${id}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1];
        }
      }

      // Trigger browser "Save As" dialog
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const viewFile = createAsyncThunk(
  "uploads/viewFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: "blob", // get raw file
      });

      // Create a blob URL for preview
      const fileUrl = URL.createObjectURL(response.data);

      return { fileId, fileUrl };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to view file");
    }
  }
);







