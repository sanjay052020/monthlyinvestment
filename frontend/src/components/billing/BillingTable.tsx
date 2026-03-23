import React, { useEffect, useState } from "react";
import "./BillingTable.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { Bill, fetchBills } from "../../features/billing/billingSlice";
import CircleLoader from "../common/CircleLoader";
import { formatIndianAmount } from "../../utils/formatAmount";

const BillingTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { bills, loading, error } = useAppSelector((state: RootState) => state.billing);

    const [searchId, setSearchId] = useState("");
    const [searchDate, setSearchDate] = useState("");

    useEffect(() => {
        dispatch(fetchBills());
    }, [dispatch]);

    if (loading) return <CircleLoader />;
    if (error) return <p className="error">{error}</p>;

    // Filter bills by ID and Date
    const filteredBills = bills.filter((bill: Bill) => {
        const matchesId = searchId ? bill.billing_id.includes(searchId) : true;
        const matchesDate = searchDate ? bill.date.startsWith(searchDate) : true;
        return matchesId && matchesDate;
    });

    return (
        <div className="billing-card">
            <div className="card-header">
                <fieldset className="inputGroupWrapper">
                    <legend className="groupLegend">Search Input</legend>
                    <div className="search-bar-Billing">
                        <input
                            type="text"
                            placeholder="Search by Bill ID"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </div>
                </fieldset>
            </div>

            {filteredBills.length === 0 ? (
                <p className="no-results">No records found.</p>
            ) : (
                filteredBills.map((bill: Bill) => (
                    <div key={bill.billing_id} className="billing-record">
                        <table className="details-table">
                            <tbody>
                                <tr className="headerRow">
                                    <td><strong>Billing ID</strong></td>
                                    <td>{bill.billing_id}</td>
                                </tr>
                                <tr className="headerRow">
                                    <td><strong>Billing Person</strong></td>
                                    <td>{bill.billing_person}</td>
                                </tr>
                                <tr className="headerRow">
                                    <td><strong>Date</strong></td>
                                    <td>{bill.date}</td>
                                </tr>
                                <tr className="headerRow">
                                    <td><strong>Mode of Payment</strong></td>
                                    <td>{bill.mode_of_payment}</td>
                                </tr>
                                <tr className="headerRow">
                                    <td><strong>Total Amount</strong></td>
                                    <td>₹ {bill.total ? formatIndianAmount(bill.total.toFixed(2)) : 0}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3>Products</h3>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Product ID</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Total</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.products.map((p, idx) => (
                                    <tr key={idx}>
                                        <td>{p.name}</td>
                                        <td>{p.productId}</td>
                                        <td>{p.qty}</td>
                                        <td>{p.rate.toFixed(2)}</td>
                                        <td>₹ {p.total ? formatIndianAmount(p.total.toFixed(2)) : 0}</td>
                                        <td>{p.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
};

export default BillingTable;