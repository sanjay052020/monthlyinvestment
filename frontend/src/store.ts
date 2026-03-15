// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import registrationReducer from "./features/auth/registrationSlice";
import investmentReducer from "./features/auth/addInvestmentSlice";
import forgotPasswordReducer from "./features/auth/forgotPasswordSlice";
import resetPasswordReducer from "./features/auth/resetPasswordSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    investment: investmentReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;