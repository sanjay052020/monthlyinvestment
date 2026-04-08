import React from "react";
import { Loan, Payment } from "../../features/loans/loanProps";
import styles from "./LoanDetails.module.css";
import { formatDate, formatIndianAmount } from "../../utils/formatAmount";
import { X } from "phosphor-react";
import PaymentTable from "./PaymentTable";
import { calculateInterestAmount, calculateTotalAmount } from "../../utils/calculateTotalAmt";

interface LoanDetailsProps {
  loan: Loan;
  onClose: () => void;
  onUpdatePayment?: (loanId: string, paymentId: string, updated: Payment) => void;
  onDeletePayment?: (loanId: string, paymentId: string) => void;
}

// Calculate remaining loan balance
export const calculateRemainingAmount = (
  amount: number,
  interestRate: number,
  months: number,
  payments: Payment[]
): number => {
  if (isNaN(amount) || isNaN(interestRate) || isNaN(months)) {
    throw new Error("Invalid input: amount, interestRate, and months must be numbers");
  }

  // total loan amount with simple interest
  const interestAmount = (amount * interestRate * months) / 100;
  const totalAmount = amount + interestAmount;

  // sum of all payments made
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  // remaining balance
  return totalAmount - paidAmount;
};

const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, onClose, onUpdatePayment, onDeletePayment }) => (
  <div className={styles.overlay}>
    <div className={styles.box}>
      <div className={styles.header}>
        <h3>Loan Details</h3>
        <button className={styles.closeIcon} onClick={onClose}>
          <X size={20} weight="bold" />
        </button>
      </div>

      <table className={styles.detailsTable}>
        <tbody>
          <tr><th>Borrower ID</th><td>{loan.borrower_id}</td></tr>
          <tr><th>Name</th><td>{loan.borrower_name}</td></tr>
          <tr><th>Mobile</th><td>{loan.mobile}</td></tr>
          <tr><th>Amount</th><td>{formatIndianAmount(loan.amount)}</td></tr>
          <tr><th>Interest Rate</th><td>{loan.interest_rate}%</td></tr>
          <tr><th>Start Date</th><td>{formatDate(loan.start_date.slice(0, 10))}</td></tr>
          <tr><th>End Date</th><td>{formatDate(loan.end_date.slice(0, 10))}</td></tr>
          <tr><th>Completed Months</th><td>{loan.months}</td></tr>
          <tr><th>Total Interest Amount</th><td>{formatIndianAmount(calculateInterestAmount(loan.amount, loan.interest_rate, loan.months ?? 0))}</td></tr>
          <tr><th>Total Amount</th><td>{formatIndianAmount(calculateTotalAmount(loan.amount, loan.interest_rate, loan.months ?? 0))}</td></tr>
          <tr><th>Remaining Balance Amount</th><td>{formatIndianAmount(calculateRemainingAmount(loan.amount, loan.interest_rate, loan.months ?? 0, loan.payments))}</td></tr>
        </tbody>
      </table>
      <PaymentTable
        loanId={loan.id || ""}
        payments={loan.payments}
        onDeletePayment={onDeletePayment}
        onUpdatePayment={onUpdatePayment}
      />
    </div>
  </div>
);

export default LoanDetails;