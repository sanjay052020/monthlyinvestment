import { AppDispatch } from "../store";
import { logout } from "../features/auth/authSlice";
import Cookies from "js-cookie";
import { NavigateFunction } from "react-router-dom";

export const handleLogoutCommon = (
  dispatch: AppDispatch,
  navigator: NavigateFunction,
  setActiveContent?: (content: string) => void
) => {
  // Clear Redux auth state
  dispatch(logout());

  // Clear cookies
  Cookies.remove("authToken");
  Cookies.remove("refreshToken");

  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Reset UI state if provided
  if (setActiveContent) {
    setActiveContent("Home");
  }

  // Redirect to login/home
  navigator("/");
};