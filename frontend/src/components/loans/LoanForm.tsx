import React from 'react';
import { Loan } from '../../features/loans/loanProps';
import styles from './LoanForm.module.css';
import { rupeesIndianAmount } from '../../utils/formatAmount';

interface LoanFormProps {
  form: Loan;
  setForm: React.Dispatch<React.SetStateAction<Loan>>;
  errors: { [key: string]: string };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const LoanForm: React.FC<LoanFormProps> = ({ form, setForm, errors, setErrors }) => {
  const clearError = (name: string, value: string | number) => {
    // simple inline validation
    let isValid = true;
    if (name === 'borrower_id' && !value) isValid = false;
    if (name === 'borrower_name' && !value) isValid = false;
    if (name === 'amount' && (!value || Number(value) <= 0)) isValid = false;
    if (name === 'interest_rate' && (Number(value) <= 0 || Number(value) > 100)) isValid = false;
    if (name === 'mobile' && (!/^\d{10}$/.test(String(value)))) isValid = false;

    if (isValid) {
      setErrors(prev => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <div>
      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Borrower ID</label>
        <input
          value={form.borrower_id}
          onChange={(e) => {
            setForm({ ...form, borrower_id: e.target.value });
            clearError('borrower_id', e.target.value);
          }}
          className={styles.loansInput}
        />
        {errors.borrower_id && <small className={styles.error}>{errors.borrower_id}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Borrower Name</label>
        <input
          value={form.borrower_name}
          onChange={(e) => {
            setForm({ ...form, borrower_name: e.target.value });
            clearError('borrower_name', e.target.value);
          }}
          className={styles.loansInput}
        />
        {errors.borrower_name && <small className={styles.error}>{errors.borrower_name}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Amount</label>
        <input
          type="text"
          value={form.amount ? rupeesIndianAmount(form.amount) : ""}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            setForm({ ...form, amount: raw ? Number(raw) : 0 });
          }}
          className={styles.loanAmtField}
        />
        {errors.amount && <small className={styles.error}>{errors.amount}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Interest Rate (%)</label>
        <input
          type="number"
          value={form.interest_rate}
          onChange={(e) => {
            const val = Number(e.target.value);
            setForm({ ...form, interest_rate: val });
            clearError('interest_rate', val);
          }}
          className={styles.loanField}
        />
        {errors.interest_rate && <small className={styles.error}>{errors.interest_rate}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Start Date</label>
        <input
          type="date"
          value={form.start_date.slice(0, 10)}
          onChange={(e) => {
            setForm({ ...form, start_date: e.target.value });
            clearError('start_date', e.target.value);
          }}
          className={styles.loanField}
        />
        {errors.start_date && <small className={styles.error}>{errors.start_date}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>End Date</label>
        <input
          type="date"
          value={form.end_date.slice(0, 10)}
          onChange={(e) => {
            setForm({ ...form, end_date: e.target.value });
            clearError('end_date', e.target.value);
          }}
          className={styles.loanField}
        />
        {errors.end_date && <small className={styles.error}>{errors.end_date}</small>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.loanfields}>Mobile</label>
        <input
          value={form.mobile}
          onChange={(e) => {
            setForm({ ...form, mobile: e.target.value });
            clearError('mobile', e.target.value);
          }}
          className={styles.loanAmtField}
        />
        {errors.mobile && <small className={styles.error}>{errors.mobile}</small>}
      </div>
    </div>
  );
};

export default LoanForm;