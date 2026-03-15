import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./AddInvestmentForm.module.css";
import { RootState } from "../../store";
import { addInvestment } from "../../features/auth/addInvestmentSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import CircleLoader from "../CircleLoader";
import Popup from "../Popup";

interface InvestmentFormData {
    amount: number;
    toInvestment: string;
    date: string;
    reason: string;
}

export const investmentOptions = [
    { value: "Society Maintenance", label: "Society Maintenance" },
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Utilities", label: "Utilities" },
    { value: "Home Expanses", label: "Home Expanses" },
    { value: "RD Expanses", label: "RD Expanses" },
    { value: "Bike Expanses", label: "Bike Expanses" },
    { value: "School Expanses", label: "School Expanses" },
    { value: "PPF Expanses", label: "PPF Expanses" },
    { value: "Wifi Expanses", label: "Wifi Expanses" },
    { value: "Milk Expanses", label: "Milk Expanses" },
    { value: "Mobile Recharge Expanses", label: "Mobile Recharge Expanses" },
    { value: "Mutual Fund Expanses", label: "Mutual Fund Expanses" },
    { value: "Stock Expanses", label: "Stock Expanses" },
    { value: "Electricity Expanses", label: "Electricity Expanses" },
    { value: "Credit Card Expanses", label: "Credit Card Expanses" },
    { value: "FD Expanses", label: "FD Expanses" },
];

const AddInvestmentForm: React.FC = () => {
    const [formData, setFormData] = useState<InvestmentFormData>({
        amount: 0,
        toInvestment: "",
        date: "",
        reason: "",
    });
    const dispatch = useAppDispatch();
    const { loading, error, data, message } = useAppSelector((state: RootState) => state.investment);
    const [showPopup, setShowPopup] = useState(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    const handleSelectChange = (option: any) => {
        setFormData((prev) => ({
            ...prev,
            toInvestment: option.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addInvestment(formData));

        console.log("Investment Submitted:", formData);
    };

    useEffect(() => {
        if (message) {
            setShowPopup(true)
            setFormData({
                amount: 0,
                date: "",
                reason: '',
                toInvestment: ""
            })
        }
    }, [message])

    useEffect(() => {
        setShowPopup(false)
    }, [])
    return (<>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Add Investment</h2>

            {/* Amount */}
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Amount:</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={styles.formInput}
                />
            </div>

            {/* To Investment with react-select */}
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>To Investment:</label>
                <Select
                    options={investmentOptions}
                    value={investmentOptions.find((opt) => opt.value === formData.toInvestment)}
                    onChange={handleSelectChange}
                    classNamePrefix="react-select"
                    placeholder="Select..."
                    styles={{
                        control: (base) => ({
                            ...base,
                            width: "106%",          // match input width
                            minHeight: "42px",
                            borderRadius: "6px",
                            borderColor: "#ccc",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "none",
                            "&:hover": { borderColor: "#0668e7" },
                        }),
                        singleValue: (base) => ({
                            ...base,
                            textAlign: "left",      // selected value left aligned
                            color: "#333",
                        }),
                        placeholder: (base) => ({
                            ...base,
                            textAlign: "left",      // placeholder left aligned
                            color: "#888",          // softer placeholder color
                        }),
                        option: (base) => ({
                            ...base,
                            textAlign: "left",      // dropdown options left aligned
                            paddingLeft: "0.75rem",
                            fontSize: "0.95rem",
                        }),
                        menu: (base) => ({
                            ...base,
                            width: "106%",          // dropdown menu same width
                        }),
                    }}
                />
            </div>

            {/* Date */}
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Date:</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={styles.formInput}
                />
            </div>

            {/* Reason */}
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Reason:</label>
                <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={3}
                    className={styles.formTextarea}
                />
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
                Submit Investment
            </button>
        </form>
        {loading && <CircleLoader />}
        {showPopup && (
            <Popup
                message={message || ""}
                onClose={() => setShowPopup(false)}
            />
        )}
    </>
    );
};

export default AddInvestmentForm;