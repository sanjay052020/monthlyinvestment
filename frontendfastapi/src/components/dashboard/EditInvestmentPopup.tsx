import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./EditInvestmentPopup.module.css";
import { Investment } from "../../features/auth/addInvestmentSlice";
import { investmentOptions } from "./investmentOptions";

interface EditInvestmentPopupProps {
    investment: Investment | null;
    onClose: () => void;
    onSave: (updated: Investment) => void;
}

interface OptionType {
  value: string;
  label: string;
}


const EditInvestmentPopup: React.FC<EditInvestmentPopupProps> = ({
    investment,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<Investment>({
        investment_id: "",
        amount: 0,
        toinvestment: "",
        date: "",
        reason: "",
        status: "",
    });

    useEffect(() => {
        if (investment) {
            setFormData(investment);
        }
    }, [investment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "amount" ? Number(value) : value,
        }));
    };

    const handleSelectChange = (option: any) => {
        setFormData((prev) => ({
            ...prev,
            toinvestment: option ? option.value : "",
        }));
    };

    // ✅ Handle status dropdown change
    const handleStatusChange = (option: any) => {
        setFormData((prev) => ({
            ...prev,
            status: option ? option.value : "",
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!investment) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <h2>Edit Investment</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Amount:
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    {/* ✅ react-select for toinvestment */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>To Investment:</label>
                        <Select
                            options={investmentOptions}
                            value={investmentOptions.find(
                                (opt: OptionType) => opt.value === formData.toinvestment
                            )}
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

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Date:
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            Reason:
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    {/* ✅ New Status Dropdown */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Status:</label>
                        <Select
                            options={[
                                { value: "pending", label: "Pending" },
                                { value: "completed", label: "Completed" },
                            ]}
                            value={
                                formData.status
                                    ? { value: formData.status, label: formData.status }
                                    : null
                            }
                            onChange={handleStatusChange}
                            classNamePrefix="react-select"
                            placeholder="Select status..."
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

                    <div className={styles.actions}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInvestmentPopup;