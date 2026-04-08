import React from "react";
import { LoanSelection } from "../../features/loans/loanProps";
import { PencilSimple, Trash, Check, X, PlusCircle } from "phosphor-react";
import styles from "./LoanActions.module.css";

interface LoanActionsProps {
  loan: LoanSelection;
  isEditing: boolean;
  onEdit: (loan: LoanSelection) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddPayment: (id: string) => void;
}

const LoanActions: React.FC<LoanActionsProps> = ({
  loan,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onAddPayment,
}) => {
  return (
    <div className={styles.actions}>
      {isEditing ? (
        <>
          <button className={styles.iconButton} onClick={onSave}>
            <Check size={20} />
          </button>
          <button className={styles.iconButton} onClick={onCancel}>
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <button className={styles.iconButton} onClick={() => onEdit(loan)} title="Edit Loans">
            <PencilSimple size={20} />
          </button>
          <button className={styles.iconButton} onClick={() => onDelete(loan.id)} title="Delete Loans">
            <Trash size={20} />
          </button>
          <button className={styles.iconButton} onClick={() => onAddPayment(loan.id)} title="Add Payments">
            <PlusCircle size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default LoanActions;