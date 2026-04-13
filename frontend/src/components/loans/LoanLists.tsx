import React, { useState, useEffect } from "react";
import LoanTable from "./LoanTable";
import LoanDetails from "./LoanDetails";
import { Loan, LoanSelection, Payment } from "../../features/loans/loanProps";
import styles from "./LoanDashboard.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchLoan } from "../../features/loans/loanThunks"; // ✅ import updatePayment
import { deletePayment, updatePayment } from "../../features/loans/paymentThunk";
import SearcComponent from "../SearchComponent";

const LoanDashboard: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const dispatch = useAppDispatch();
  const { loans, loading } = useAppSelector((state) => state.loan);
  const [localLoans, setLocalLoans] = useState<LoanSelection[]>([]);



  // ✅ Update handler with optimistic update
  const handleUpdatePayment = (loanId: string, paymentId: string, updated: Payment) => {
    if (selectedLoan) {
      const updatedPayments = selectedLoan.payments.map(p =>
        p.id === paymentId ? updated : p
      );

      const updatedLoan: LoanSelection = {
        ...selectedLoan,
        id: selectedLoan.id!, // non-null assertion
        payments: updatedPayments,
      };

      // ✅ Correct object spread
      setSelectedLoan({ ...selectedLoan, payments: updatedPayments });

      // ✅ update localLoans immediately
      setLocalLoans(prev =>
        prev.map(l => (l.id === loanId ? updatedLoan : l))
      );

      dispatch(updatePayment({ loanId, paymentId, data: updated }))
        .unwrap()
        .then(() => dispatch(fetchLoan(loanId))) // refresh from server
        .catch(err => console.error("Update failed:", err));
    }
  };

  // ✅ Delete handler
  const handleDeletePayment = (loanId: string, paymentId: string) => {
    if (selectedLoan) {
      // ✅ Optimistically update local state
      const updatedPayments = selectedLoan.payments.filter(p => p.id !== paymentId);
      setSelectedLoan({ ...selectedLoan, payments: updatedPayments });

      const updatedLoan: LoanSelection = {
        ...selectedLoan,
        id: selectedLoan.id!, // non-null assertion
        payments: updatedPayments,
      };

      // ✅ update localLoans immediately
      setLocalLoans(prev =>
        prev.map(l => (l.id === loanId ? updatedLoan : l))
      );
    }


    // ✅ Dispatch delete to backend
    dispatch(deletePayment({ loanId, paymentId }))
      .unwrap()
      .then(() => dispatch(fetchLoan(loanId))) // refresh from server
      .catch((err) => console.error("Delete failed:", err));
  };


  // ✅ Initial fetch when popup opens
  useEffect(() => {
    if (selectedLoan?.id) {
      dispatch(fetchLoan(selectedLoan.id));
    }
  }, [dispatch, selectedLoan?.id]);

  useEffect(() => {
    setLocalLoans(loans);
  }, [loans]);


  return (
    <div className={styles.dashboard}>
      <span className={styles.loanTitle}>Loan Management Dashboard</span>

      {/* Search bar */}
      <SearcComponent query={query} setQuery={setQuery} placeHolder="Search by Borrower ID or Name..."/>

      {/* Table of loans */}
      <LoanTable
        query={query}
        onRowClick={setSelectedLoan}
        loans={localLoans}
        loading={loading}
      />

      {/* Popup details */}
      {selectedLoan && (
        <LoanDetails
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          onUpdatePayment={handleUpdatePayment}
          onDeletePayment={handleDeletePayment}
        />
      )}

    </div>
  );
};

export default LoanDashboard;