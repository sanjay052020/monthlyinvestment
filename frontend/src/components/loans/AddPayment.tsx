import React, { useState } from "react";
import { X } from "phosphor-react"; // import a close icon
import styles from "./AddPayment.module.css";

interface AddPaymentProps {
  onSubmit: (payment: { date: string; amount: number; source: string }) => void;
  onClose: () => void; // optional close handler
}

const AddPayment: React.FC<AddPaymentProps> = ({ onSubmit, onClose }) => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [source, setSource] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !amount || !source) return;

    onSubmit({ date, amount: Number(amount), source });
    setDate("");
    setAmount("");
    setSource("");
    if (onClose) onClose(); // close after submit
  };


  return (
    <div className={styles.card}>
      <div className={styles.popupOverlay}>
        <div className={styles.popupContent}>
          <div>
            <h2 className={styles.header}>Add Payment</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.paymentForm}>
            <label className={styles.addpaymentlabel}>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className={styles.addpaymentlabel}>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber)}
                min="0"
                step="0.01"
              />
            </label>

            <label className={styles.addpaymentlabel}>
              Source:
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={styles.sourceInput}
              />
            </label>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;