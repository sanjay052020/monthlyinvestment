import React, { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { updateLoan, deleteLoan, fetchLoans } from "../../features/loans/loanThunks";
import { LoanSelection } from "../../features/loans/loanProps";
import { formatDate, formatIndianAmount } from "../../utils/formatAmount";
import LoanActions from "./LoanActions";
import styles from "./LoanTable.module.css";
import AddPayment from "./AddPayment";
import { createPayment } from "../../features/loans/paymentThunk";


interface LoanRowProps {
    loan: LoanSelection;
    onRowClick: () => void;
    onActionComplete: (msg: string) => void;
}

const LoanRow: React.FC<LoanRowProps> = ({ loan, onRowClick, onActionComplete }) => {
    const dispatch = useAppDispatch();
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<LoanSelection | null>(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

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

    const handleAddPaymentClick = (id: string) => {
        setShowPaymentPopup(true); // open popup for this loan
    };

    const handlePaymentSubmit = (payment: { date: string; amount: number; source: string }) => {
        // Dispatch with correct payload shape
        dispatch(
            createPayment({
                loanId: loan.id,
                payment: {
                    date: payment.date,
                    amount: payment.amount,
                    source: payment.source,
                },
            })
        )
            .unwrap()
            .then(() => {
                onActionComplete("Payment added successfully");
                setShowPaymentPopup(false);
                dispatch(fetchLoans())
            })
            .catch((err) => {
                console.error("Failed to create payment:", err);
            });



        // Example: dispatch(addPaymentToLoan({ loanId: loan.id, ...payment }))
        onActionComplete("Payment added successfully");
        setShowPaymentPopup(false); // close popup after submit
    };





    return (<>
        <tr className={styles.clickableRow} onClick={() => { if (!isEditing) onRowClick(); }}>
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
            <td>{isEditing ? <input value={editForm?.start_date?.split("T")[0] || ""} onChange={(e) => setEditForm((prev) => prev ? { ...prev, start_date: e.target.value } : null)} /> : formatDate(loan?.start_date?.split("T")[0])}</td>
            <td>{isEditing ? <input value={editForm?.end_date?.split("T")[0] || ""} onChange={(e) => setEditForm((prev) => prev ? { ...prev, end_date: e.target.value } : null)} /> : formatDate(loan?.end_date?.split("T")[0])}</td>
            <td onClick={(e) => e.stopPropagation()}>
                <LoanActions
                    loan={loan}
                    isEditing={isEditing}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onAddPayment={handleAddPaymentClick}
                />
            </td>
        </tr>
        {showPaymentPopup && (
            <AddPayment onSubmit={handlePaymentSubmit} onClose={() => setShowPaymentPopup(false)} />
        )}
    </>
    );
};

export default LoanRow;