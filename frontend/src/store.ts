import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import registrationReducer from "./features/auth/registrationSlice";
import investmentReducer from "./features/auth/addInvestmentSlice";
import forgotPasswordReducer from "./features/auth/forgotPasswordSlice";
import resetPasswordReducer from "./features/auth/resetPasswordSlice";
import navbarReducer from "./features/navbar/navbarSlice";
import userContactReducer from "./features/usercontact/userContactSlice";
import billingReducer from "./features/billing/billingSlice";
import loanReducer from "./features/loans/loanSlice";
import paymentReducer from './features/loans/paymentSlice';
import urlReducer from './features/urls/urlSlice';
import uploadsReducer from './features/uploads/uploadsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    investment: investmentReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    navbar: navbarReducer,
    userContact: userContactReducer,
    billing: billingReducer,
    loan: loanReducer,
    payments: paymentReducer,
    urls: urlReducer,
    uploads: uploadsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;