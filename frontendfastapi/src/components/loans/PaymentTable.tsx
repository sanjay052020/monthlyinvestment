import React, { useState } from "react";
import { Payment } from "../../features/loans/loanProps";
import styles from "./PaymentTable.module.css";
import { formatIndianAmount } from "../../utils/formatAmount";
import { PencilSimple, Trash, Check, XCircle } from "phosphor-react";

interface PaymentTableProps {
  loanId: string;
  payments: Payment[];
  onDeletePayment?: (loanId: string, paymentId: string) => void;
  onUpdatePayment?: (loanId: string, paymentId: string, updated: Payment) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ loanId, payments, onDeletePayment, onUpdatePayment }) => {
  const [editPaymentId, setEditPaymentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Payment | null>(null);

  const handleEdit = (payment: Payment) => {
    setEditPaymentId(payment.id);
    setEditForm({ ...payment });
  };

  const handleCancel = () => {
    setEditPaymentId(null);
    setEditForm(null);
  };

  const handleSave = () => {
    if (editForm && onUpdatePayment) {
      onUpdatePayment(loanId, editPaymentId!, editForm);
    }
    setEditPaymentId(null);
    setEditForm(null);
  };

  return (
    <div>
      {payments && payments.length > 0 ? (
        <table className={styles.paymentsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const isEditing = editPaymentId === payment.id;
              return (
                <tr key={payment.id}>
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm?.date?.slice(0, 10) || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, date: e.target.value } : null
                          )
                        }
                      />
                    ) : (
                      payment.date?.slice(0, 10)
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm?.amount || 0}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, amount: Number(e.target.value) } : null
                          )
                        }
                      />
                    ) : (
                      formatIndianAmount(payment.amount)
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editForm?.source || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, source: e.target.value } : null
                          )
                        }
                      />
                    ) : (
                      payment.source
                    )}
                  </td>
                  <td className={styles.actions}>
                    {isEditing ? (
                      <>
                        <button onClick={handleSave}><Check size={18} /></button>
                        <button onClick={handleCancel}><XCircle size={18} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(payment)}><PencilSimple size={18} /></button>
                        <button onClick={() => onDeletePayment && onDeletePayment(loanId, payment.id)}><Trash size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No payments recorded yet.</p>
      )}
    </div>
  );
};

export default PaymentTable;