import React, { useEffect, useState } from "react";
import { Bill, deleteProductFromBill, fetchBills } from "../../features/billing/billingSlice";
import CircleLoader from "../common/CircleLoader";
import { formatIndianAmount } from "../../utils/formatAmount";
import { PencilSimple, FloppyDisk, Trash, XCircle } from "phosphor-react";
import "./BillingTable.css";
import "./BillingRecord.css"
import { useAppDispatch } from "../../hooks";

interface BillingRecordProps {
    bill: Bill;
    onSave: (updatedBill: Bill) => void;
    onDelete: (id: string) => void;
}

const BillingRecord: React.FC<BillingRecordProps> = ({ bill, onSave, onDelete }) => {
    const [loadingOnScroll, setLoadingOnScroll] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBill, setEditedBill] = useState<Bill>(bill);
    const dispatch = useAppDispatch();

    const handleChange = (field: keyof Bill, value: string) => {
        setEditedBill({ ...editedBill, [field]: value });
    };

    const handleProductChange = (index: number, field: string, value: string | number) => {
        const updatedProducts = [...editedBill.products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setEditedBill({ ...editedBill, products: updatedProducts });
    };

    const handleSave = () => {
        if (onSave) onSave(editedBill);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedBill(bill); // reset changes
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (onDelete) onDelete(bill.billing_id);
        dispatch(fetchBills());
    };

    const handleDeleteProduct = (productId: string) => {
        dispatch(deleteProductFromBill({ billing_id: bill.billing_id, product_id: productId }));
    };

    useEffect(() => {
        setEditedBill(bill); // ✅ sync with Redux updates        
    }, [bill]);

    return (
        <div key={bill.billing_id} className="billing-record">
            <div className="record-actions">
                {isEditing ? (
                    <>
                        <button className="btn recordsave-btn" title="Save Bill" onClick={handleSave}>
                            <FloppyDisk size={20} weight="bold" />
                        </button>
                        <button className="btn recordcancel-btn" title="Cancel Edit" onClick={handleCancel}>
                            <XCircle size={20} weight="bold" />
                        </button>
                    </>
                ) : (
                    <button className="btn recordedit-btn" title="Edit Bill" onClick={() => setIsEditing(true)}>
                        <PencilSimple size={20} weight="bold" />
                    </button>
                )}
                <button
                    className="btn rocorddelete-btn"
                    title="Delete Bill"
                    onClick={handleDelete}
                >
                    <Trash size={20} weight="bold" />
                </button>
            </div>


            {/* Bill details */}
            <table className="details-table">
                <tbody>
                    <tr className="headerRow">
                        <td><strong>Billing ID</strong></td>
                        <td>{bill.billing_id}</td>
                    </tr>
                    <tr className="headerRow">
                        <td><strong>Billing Person</strong></td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedBill.billing_person}
                                    onChange={(e) => handleChange("billing_person", e.target.value)}
                                />
                            ) : (
                                bill.billing_person
                            )}
                        </td>
                    </tr>
                    <tr className="headerRow">
                        <td><strong>Date</strong></td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editedBill.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                />
                            ) : (
                                bill.date
                            )}
                        </td>
                    </tr>
                    <tr className="headerRow">
                        <td><strong>Mode of Payment</strong></td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedBill.mode_of_payment}
                                    onChange={(e) => handleChange("mode_of_payment", e.target.value)}
                                />
                            ) : (
                                bill.mode_of_payment
                            )}
                        </td>
                    </tr>
                    <tr className="headerRow">
                        <td><strong>Total Amount</strong></td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editedBill.total}
                                    onChange={(e) => handleChange("total", e.target.value)}
                                />
                            ) : (
                                `₹ ${bill.total ? formatIndianAmount(bill.total.toFixed(2)) : 0}`
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Products table */}
            <h3>Products</h3>
            <div
                className="products-scroll-container"
                onScroll={() => {
                    setLoadingOnScroll(true);
                    setTimeout(() => setLoadingOnScroll(false), 800);
                }}
            >
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Product ID</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Total</th>
                            <th>Weight</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {editedBill.products.map((p, idx) => (
                            <tr key={idx}>
                                <td>{isEditing ? <input type="text" value={p.name} onChange={(e) => handleProductChange(idx, "name", e.target.value)} /> : p.name}</td>
                                <td>{isEditing ? <input type="text" value={p.productId} onChange={(e) => handleProductChange(idx, "productId", e.target.value)} /> : p.productId}</td>
                                <td>{isEditing ? <input type="number" value={p.qty} onChange={(e) => handleProductChange(idx, "qty", Number(e.target.value))} /> : p.qty}</td>
                                <td>{isEditing ? <input type="number" value={p.rate} onChange={(e) => handleProductChange(idx, "rate", Number(e.target.value))} /> : p.rate.toFixed(2)}</td>
                                <td>{isEditing ? <input type="number" value={p.total} onChange={(e) => handleProductChange(idx, "total", Number(e.target.value))} /> : `₹ ${p.total ? formatIndianAmount(p.total.toFixed(2)) : 0}`}</td>
                                <td>{isEditing ? <input type="text" value={p.weight} onChange={(e) => handleProductChange(idx, "weight", e.target.value)} /> : p.weight}</td>
                                <td>
                                    <button
                                        className="btn productdelete-btn"
                                        title="Delete Product"
                                        onClick={() => handleDeleteProduct(p.productId)}
                                    >
                                        <Trash size={18} weight="bold" />
                                    </button>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {loadingOnScroll && <CircleLoader />}
        </div>
    );
};

export default BillingRecord;