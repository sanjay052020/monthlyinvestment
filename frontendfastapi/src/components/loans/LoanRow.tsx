import React, { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { updateLoan, deleteLoan } from "../../features/loans/loanThunks";
import { LoanSelction } from "../../features/loans/loanProps";
import { formatIndianAmount } from "../../utils/formatAmount";
import LoanActions from "./LoanActions";
import styles from "./LoanTable.module.css";

interface LoanRowProps {
    loan: LoanSelction;
    onRowClick: () => void;
    onActionComplete: (msg: string) => void;
}

const LoanRow: React.FC<LoanRowProps> = ({ loan, onRowClick, onActionComplete }) => {
    const dispatch = useAppDispatch();
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<LoanSelction | null>(null);

    const isEditing = editRowId === loan.id;

    const handleEdit = () => {
        setEditRowId(loan.id);
        setEditForm({ ...loan });
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditForm(null);
    };

    const handleSave = () => {
        if (editForm) {
            const { id, ...updatedData } = editForm;
            dispatch(updateLoan({ id, data: updatedData }))
                .unwrap()
                .then(() => onActionComplete("Loan updated successfully"))
                .catch((err) => console.error("Failed to update loan:", err));
        }
        setEditRowId(null);
        setEditForm(null);
    };

    const handleDelete = () => {
        dispatch(deleteLoan(loan.id))
            .unwrap()
            .then((res) => onActionComplete(res.message || "Loan deleted successfully"))
            .catch((err) => console.error("Failed to delete loan:", err));
    };

    return (
        <tr
            className={styles.clickableRow}
            onClick={() => {
                if (!isEditing) onRowClick();
            }}
        >
            <td>
                {isEditing ? (
                    <input
                        value={editForm?.borrower_id || ""}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, borrower_id: e.target.value } : null)
                        }
                    />
                ) : (
                    loan.borrower_id
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        value={editForm?.borrower_name || ""}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, borrower_name: e.target.value } : null)
                        }
                    />
                ) : (
                    loan.borrower_name
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        value={editForm?.amount || 0}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, amount: Number(e.target.value) } : null)
                        }
                    />
                ) : (
                    formatIndianAmount(loan.amount)
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        value={editForm?.interest_rate || 0}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, interest_rate: Number(e.target.value) } : null)
                        }
                    />
                ) : (
                    `${loan.interest_rate}%`
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        value={editForm?.mobile || ""}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, mobile: e.target.value } : null)
                        }
                    />
                ) : (
                    loan.mobile
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        value={editForm?.status || ""}
                        onChange={(e) =>
                            setEditForm((prev) => prev ? { ...prev, status: e.target.value } : null)
                        }
                    />
                ) : (
                    loan.status
                )}
            </td>
            <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <LoanActions
                    loan={loan}
                    isEditing={isEditing}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </td>
        </tr>
    );
};

export default LoanRow;