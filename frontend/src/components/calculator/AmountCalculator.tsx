import React, { useState } from "react";
import { PlusCircle, Trash, Calculator as CalculatorIcon } from "phosphor-react";
import "./AmountCalculator.css";
import { formatIndianAmount } from "../../utils/formatAmount";
import Calculator from "./Calculator";

type Entry = {
    text: string;
    amount: number;
};

const AmountCalculator: React.FC = () => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [text, setText] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [showCalculator, setShowCalculator] = useState<boolean>(false)
    const handleAdd = () => {
        if (text && amount > 0) {
            setEntries([...entries, { text, amount }]);
            setText("");
            setAmount(0);
        }
    };

    const handleDelete = (index: number) => {
        const updated = entries.filter((_, i) => i !== index);
        setEntries(updated);
    };

    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

    return (
        <div className="shadow-box">
            {/* Top-right Calculator button with icon */}
            <button className="calculator-btn" onClick={() => {
                setShowCalculator(true)
                setEntries([])
            }}>
                <CalculatorIcon size={22} weight="bold" />
            </button>

            <h2>Amount Calculator</h2>

            <div className="input-row">
                <input
                    type="text"
                    placeholder="Enter text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value)
                        setShowCalculator(false)
                    }}
                    className="amt-login-input"
                />

                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="amt-login-input"
                />

                <button onClick={handleAdd} className="icon-btn">
                    <PlusCircle size={20} weight="bold" />
                </button>
            </div>

            <h3>Total Amount: ₹{formatIndianAmount(totalAmount)}</h3>

            {entries.length > 0 && (
                <table className="entries-table">
                    <thead>
                        <tr>
                            <th>Text</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.text}</td>
                                <td>₹{formatIndianAmount(entry.amount)}</td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(index)}
                                    >
                                        <Trash size={18} weight="bold" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {
                showCalculator && <Calculator />
            }
        </div>
    );
};

export default AmountCalculator;