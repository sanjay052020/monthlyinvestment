import React from "react";
import { LoanSelction } from "../../features/loans/loanProps";
import { PencilSimple, Trash, Check, X } from "phosphor-react";
import styles from "./LoanActions.module.css";

interface LoanActionsProps {
  loan: LoanSelction;
  isEditing: boolean;
  onEdit: (loan: LoanSelction) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const LoanActions: React.FC<LoanActionsProps> = ({
  loan,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
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
          <button className={styles.iconButton} onClick={() => onEdit(loan)}>
            <PencilSimple size={20} />
          </button>
          <button className={styles.iconButton} onClick={() => onDelete(loan.id)}>
            <Trash size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default LoanActions;