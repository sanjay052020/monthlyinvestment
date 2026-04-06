import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../api';

// Define the shape of a user contact
export interface UserContact {
    investment_id?: string;
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
    "userContact/createUserContact",
    async (contactData: UserContact, { rejectWithValue }) => {
        try {
            const response = await api.post("/api/users", contactData);
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
            const response = await api.get("/api/users");
            return response.data.users;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// READ ONE BY MOBILE
export const fetchUserContactByMobile = createAsyncThunk(
    "userContact/fetchUserContactByMobile",
    async (mobile: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/users/mobile/${mobile}`);
            return response.data.user; // user object if found
        } catch (err: any) {
            // If backend returns 404, treat as "not found" instead of error
            if (err.response?.status === 404) {
                return null;
            }
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
    "userContact/updateUserContact",
    async (
        { userId, contactData }: { userId: string; contactData: Partial<UserContact> },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(`/api/users/${userId}`, contactData);
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

            //fetch Mobile no
            .addCase(fetchUserContactByMobile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.lastMessage = null;
            })
            .addCase(fetchUserContactByMobile.fulfilled, (state, action: PayloadAction<UserContact | null>) => {
                state.loading = false;
                if (action.payload) {
                    // User exists → duplicate mobile
                    state.selectedContact = action.payload;
                    state.lastMessage = "This mobile number is already registered.";
                } else {
                    // No user found → mobile is available
                    state.selectedContact = null;
                    state.lastMessage = null; // or "Mobile number is available" if you want feedback
                }
            })
            .addCase(fetchUserContactByMobile.rejected, (state, action) => {
                state.loading = false;
                const errorPayload = action.payload as { error?: string };
                state.error = errorPayload?.error || "User not found";
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

            // READ ONE
            .addCase(fetchUserContact.fulfilled, (state, action: PayloadAction<UserContact>) => {
                state.loading = false;
                state.selectedContact = action.payload;
            })

            // UPDATE
            .addCase(updateUserContact.fulfilled, (state, action) => {
                state.lastMessage = action.payload.message;
                const idx = state.contacts.findIndex(c => c.investment_id === action.payload._id);
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
                state.contacts = state.contacts.filter(c => c.investment_id !== action.payload._id);
            });
    },
});

export const { resetLastMessage } = userContactSlice.actions;
export default userContactSlice.reducer;