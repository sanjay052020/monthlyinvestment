import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';
import { UserContact } from '../../components/contacts/userContact';

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
    "userContact/createUserContact",
    async (contactData: UserContact, { rejectWithValue }) => {
        try {
            const response = await api.post("/users", contactData);
            return response.data; // { message, user }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || "Something went wrong";
            return rejectWithValue({ message: errorMessage });
        }
    }
);



// READ ALL
export const fetchUserContacts = createAsyncThunk(
    'userContact/fetchUserContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/users");
            return response.data;
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
            const response = await api.get(`${"/users"}/${userId}`);
            return response.data.user;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// UPDATE
export const updateUserContact = createAsyncThunk(
    "userContact/updateUserContact",
    async (
        { userId, contactData }: { userId: string; contactData: Partial<UserContact> },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(`/users/${userId}`, contactData);
            return { userId, ...response.data, contactData }; // { message, _id, ... }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || "Something went wrong";
            return rejectWithValue({ message: errorMessage });
        }
    }
);

// DELETE
export const deleteUserContact = createAsyncThunk(
    'userContact/deleteUserContact',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`${"/users"}/${userId}`);
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
                state.lastMessage = null;
            })
            .addCase(createUserContact.fulfilled, (state, action) => {
                state.loading = false;
                state.lastMessage = action.payload.message;
                if (action.payload.user) {
                    state.contacts.push(action.payload.user);
                }
            })
            .addCase(createUserContact.rejected, (state, action) => {
                state.loading = false;
                const errorPayload = action.payload as { message: string };
                state.error = errorPayload.message;
                state.lastMessage = errorPayload.message;
            })

            // READ ALL
            .addCase(fetchUserContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.lastMessage = null;
            })
            .addCase(fetchUserContacts.fulfilled, (state, action: PayloadAction<UserContact[]>) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchUserContacts.rejected, (state, action) => {
                state.loading = false;
                const errorPayload = action.payload as { message: string };
                state.error = "Duplicate Mobile Number";
                state.lastMessage = errorPayload.message;
            })

            // READ ONE
            .addCase(fetchUserContact.fulfilled, (state, action: PayloadAction<UserContact>) => {
                state.loading = false;
                state.selectedContact = action.payload;
            })

            // UPDATE
            .addCase(updateUserContact.fulfilled, (state, action) => {
                state.lastMessage = action.payload.message;
                const idx = state.contacts.findIndex(c => c.userid === action.payload._id);
                if (idx !== -1) {
                    state.contacts[idx] = { ...state.contacts[idx], ...action.payload.contactData };
                }
            })
            .addCase(updateUserContact.rejected, (state, action) => {
                state.loading = false;
                const errorPayload = action.payload as { message: string };
                state.error = errorPayload.message;
                state.lastMessage = errorPayload.message;
            })

            // DELETE
            .addCase(deleteUserContact.fulfilled, (state, action) => {
                state.lastMessage = action.payload.message;
                state.contacts = state.contacts.filter(c => c.userid !== action.payload._id);
            });
    },
});

export const { resetLastMessage } = userContactSlice.actions;
export default userContactSlice.reducer;