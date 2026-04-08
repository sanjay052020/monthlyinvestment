import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchLoans, fetchLoan } from "../../features/loans/loanThunks";
import { LoanSelction } from "../../features/loans/loanProps";
import styles from "./LoanTable.module.css";
import CircleLoader from "../common/CircleLoader";
import LoanRow from "./LoanRow";
import Popup from "../common/Popup";

interface LoanTableProps {
    query: string;
    onRowClick: (loan: LoanSelction) => void;
}

const LoanTable: React.FC<LoanTableProps> = ({ query, onRowClick }) => {
    const dispatch = useAppDispatch();
    const { loans, loading } = useAppSelector((state) => state.loan);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMsg, setPopupMsg] = useState("");


    useEffect(() => {
        dispatch(fetchLoans());
    }, [dispatch]);

    const normalizedQuery = query.toLowerCase();
    const filteredLoans = loans.filter((loan: LoanSelction) => {
        const borrowerId = loan.borrower_id?.toLowerCase() || "";
        const borrowerName = loan.borrower_name?.toLowerCase() || "";
        return borrowerId.includes(normalizedQuery) || borrowerName.includes(normalizedQuery);
    });

    return (
        <div className={styles.tableWrapper}>
            <h2>Loans Tables Data</h2>
            {loading && <CircleLoader />}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Borrower ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Interest Rate</th>
                        <th>Mobile</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLoans.map((loan) => (
                        <LoanRow
                            key={loan.id}
                            loan={loan}
                            onRowClick={() => {
                                dispatch(fetchLoan(loan.id));
                                onRowClick(loan);
                            }}
                            onActionComplete={(msg: string) => {
                                setPopupMsg(msg);
                                setShowPopup(true);
                            }}
                        />
                    ))}
                </tbody>
            </table>
            {showPopup && <Popup message={popupMsg} onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default LoanTable;