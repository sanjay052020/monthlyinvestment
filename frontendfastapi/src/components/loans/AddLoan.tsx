import React, { useState } from 'react';
import LoanForm from './LoanForm';
import styles from './AddLoan.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Loan } from '../../features/loans/loanProps';
import { createLoan } from '../../features/loans/loanThunks';
import Popup from '../common/Popup';
import CircleLoader from '../common/CircleLoader';

const AddLoan: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const { loading } = useAppSelector(state => state.loan);

  const [form, setForm] = useState<Loan>({
    borrower_id: '',
    borrower_name: '',
    amount: 0,
    interest_rate: 0,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
    status: 'active',
    payments: [],
    mobile: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.borrower_id) newErrors.borrower_id = 'Borrower ID is required';
    if (!form.borrower_name) newErrors.borrower_name = 'Borrower Name is required';
    if (!form.amount || form.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!form.interest_rate || form.interest_rate <= 0 || form.interest_rate > 100) {
      newErrors.interest_rate = 'Interest rate must be between 1 and 100';
    }
    if (!form.start_date) newErrors.start_date = 'Start date is required';
    if (!form.end_date) newErrors.end_date = 'End date is required';
    if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = 'Mobile must be 10 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return; // stop if invalid

    try {
      const resultAction = await dispatch(createLoan(form));
console.log(resultAction);

      if (createLoan.fulfilled.match(resultAction)) {
        const { message, loan } = resultAction.payload; // ✅ both available
        console.log("Loan created:", message, loan);

        setShowPopup(true);
        setForm({
          borrower_id: "",
          borrower_name: "",
          amount: 0,
          interest_rate: 0,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          status: "active",
          payments: [],
          mobile: "",
        });
        setErrors({});
      }
    } catch (err) {
      console.error("Failed to create loan", err);
    }
  };

  return (
    <div className={styles.card}>
      <span className={styles.title}>Create Loan</span>
      <form onSubmit={handleSubmit}>
        <div className={styles.formSection}>
          <LoanForm form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
        </div>
        <button type="submit" className={styles.submitButton}>
          Create Loan
        </button>
      </form>
      {loading && <CircleLoader />}
      {showPopup && <Popup message="Created Successfully." onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default AddLoan;