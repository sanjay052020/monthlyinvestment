import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

// Define the shape of a user contact
export interface UserContact {
    _id?: string;
    name: string;
    mobile: string;
    address: string;
    state: string;
    city: string;
    pin: string;
}

// Define slice state
interface UserContactState {
    contacts: UserContact[];
    selectedContact: UserContact | null;
    loading: boolean;
    error: string | null;
    lastMessage: string | null;
}

const initialState: UserContactState = {
    contacts: [],
    selectedContact: null,
    loading: false,
    error: null,
    lastMessage: null,
};

// CREATE
export const createUserContact = createAsyncThunk(
    'userContact/createUserContact',
    async (contactData: UserContact, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/api/users",
                contactData
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// READ ALL
export const fetchUserContacts = createAsyncThunk(
    'userContact/fetchUserContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/users");
            return response.data.users;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// READ ONE
export const fetchUserContact = createAsyncThunk(
    'userContact/fetchUserContact',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`${"/api/users"}/${userId}`);
            return response.data.user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// UPDATE
export const updateUserContact = createAsyncThunk(
    'userContact/updateUserContact',
    async (
        { userId, contactData }: { userId: string; contactData: Partial<UserContact> },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(
                `${"/api/users"}/${userId}`,
                contactData
            );
            return { userId, ...response.data, contactData };
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// DELETE
export const deleteUserContact = createAsyncThunk(
    'userContact/deleteUserContact',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${"/api/users"}/${userId}`);
            return { userId, ...response.data };
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const userContactSlice = createSlice({
    name: 'userContact',
    initialState,
    reducers: {
        resetLastMessage: (state) => {
            state.lastMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createUserContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUserContact.fulfilled, (state, action) => {
                state.loading = false;
                state.lastMessage = action.payload.message;
                state.contacts.push(action.payload);
            })
            .addCase(createUserContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // READ ALL
            .addCase(fetchUserContacts.fulfilled, (state, action: PayloadAction<UserContact[]>) => {
                state.contacts = action.payload;
            })

            // READ ONE
            .addCase(fetchUserContact.fulfilled, (state, action: PayloadAction<UserContact>) => {
                state.selectedContact = action.payload;
            })

            // UPDATE
            .addCase(updateUserContact.fulfilled, (state, action) => {
                state.lastMessage = action.payload.message;
                const idx = state.contacts.findIndex(c => c._id === action.payload._id);
                if (idx !== -1) {
                    state.contacts[idx] = { ...state.contacts[idx], ...action.payload.contactData };
                }
            })

            // DELETE
            .addCase(deleteUserContact.fulfilled, (state, action) => {
                state.lastMessage = action.payload.message;
                state.contacts = state.contacts.filter(c => c._id !== action.payload._id);
            });
    },
});

export const { resetLastMessage } = userContactSlice.actions;
export default userContactSlice.reducer;