import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UploadProps } from "./uploadsTypes";
import { deleteUpload, downloadFiles, fetchUploads, saveUpload, updateUpload, viewFile } from "./uploadThunks";

interface UploadsState {
    items: UploadProps[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    loading: boolean;
    error: string | null;
    viewedFiles: Record<string, string>;
}

const initialState: UploadsState = {
    items: [],
    status: 'idle',
    loading: false,
    error: null,
    viewedFiles: {},
};

const uploadsSlice = createSlice({
    name: 'uploads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchUploads
            .addCase(fetchUploads.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(fetchUploads.fulfilled, (state, action: PayloadAction<UploadProps[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchUploads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                state.loading = false;
            })
            // saveUpload
            .addCase(saveUpload.pending, (state) => {
                state.status = "loading";
                state.loading = true;
            })
            .addCase(saveUpload.fulfilled, (state, action: PayloadAction<UploadProps>) => {
                state.status = 'succeeded';
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(saveUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateUpload
            .addCase(updateUpload.pending, (state) => {
                state.status = 'loading';
                state.loading = false;
            })
            .addCase(updateUpload.fulfilled, (state, action: PayloadAction<UploadProps>) => {
                const updated = action.payload;
                state.loading = false;
                state.status = 'succeeded';
                const index = state.items.findIndex((i) => i.id === updated.id);
                if (index >= 0) {
                    state.items[index] = updated;
                }
            })
            .addCase(updateUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            // deleteUpload
            .addCase(deleteUpload.pending, (state) => {
                state.status = 'loading';
                state.loading = true;
            })
            .addCase(deleteUpload.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.status = 'succeeded';
                state.items = state.items.filter((i) => i.id !== action.payload);
            })
            .addCase(deleteUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.loading = false;
                state.error = action.payload as string;
            })
            // saveUpload, updateUpload, deleteUpload cases...
            .addCase(downloadFiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(downloadFiles.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(downloadFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(viewFile.pending, (state)=>{
                state.loading = true;
            })
            .addCase(viewFile.fulfilled, (state, action) => {
                const { fileId, fileUrl } = action.payload;
                state.viewedFiles[fileId] = fileUrl;
                state.loading = false;
            });
    },
});

export default uploadsSlice.reducer;