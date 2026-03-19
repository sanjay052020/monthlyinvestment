import React, { useEffect } from "react";
import { ChartBar } from "phosphor-react";
import styles from "./Navbar.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { handleLogoutCommon } from "../../utils/logoutHelper";
import { fetchUserDetails, clearUser } from "../../features/navbar/navbarSlice";

const Navbar: React.FC<{ avatarUrl: string }> = ({ avatarUrl }) => {
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const { user, loading, error } = useAppSelector((state) => state.navbar);

  useEffect(() => {
    // ✅ Get email from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      dispatch(fetchUserDetails(storedEmail));
    } else {
      // fallback: fetch current user from token
      dispatch(fetchUserDetails());
    }
  }, [dispatch]);

  const handleLogout = () => {
    handleLogoutCommon(dispatch, navigator);
    dispatch(clearUser());
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftIcons}>
        <ChartBar size={24} weight="bold" className={styles.icon} />
      </div>

      <div className={styles.userSection}>
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} alt="User" className={styles.avatar} />
          <div className={styles.userDetails}>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {user && (
              <>
                <p className={styles.userName}>{user.email}</p>
                <p className={styles.userEmail}>Role: {user.role}</p>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;