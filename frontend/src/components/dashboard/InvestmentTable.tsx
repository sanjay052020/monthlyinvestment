import React, { useEffect, useState } from "react";
import styles from "./InvestmentTable.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteInvestment, fetchAllInvestments, Investment, updateInvestment } from "../../features/auth/addInvestmentSlice";
import { RootState } from "../../store";
import { formatAmount, formatDate, formatIndianAmount } from "../../utils/formatAmount";
import { Trash, Pencil, ArrowUp, ArrowDown } from "phosphor-react";
import CircleLoader from "../CircleLoader";
import Popup from "../Popup";
import EditInvestmentPopup from "./EditInvestmentPopup";

const InvestmentTable: React.FC = () => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // ✅ added state
    const rowsPerPage = 10;
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const dispatch = useAppDispatch();
    const { list, loading, message, error } = useAppSelector((state: RootState) => state.investment);

    useEffect(() => {
        dispatch(fetchAllInvestments());
    }, [dispatch]);

    // ✅ Show popup whenever message changes
    useEffect(() => {
        if (message) {
            setShowPopup(true);
        }
    }, [message]);

    useEffect(() => {
        setShowPopup(false);
    }, [])

    // ✅ Filter data by month/year
    const filteredData =
        list?.filter((item) => {
            const itemDate = new Date(item.date);
            const itemMonth = (itemDate.getMonth() + 1).toString();
            const itemYear = itemDate.getFullYear().toString();

            return (
                (month ? itemMonth === month : true) &&
                (year ? itemYear === year : true)
            );
        }) || [];

    // ✅ Calculate total amount
    const totalAmount = filteredData.reduce(
        (sum, inv) => sum + Number(inv.amount),
        0
    );

    const sortedData = [...filteredData].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (!sortOrder) return 0; // no sorting
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });


    // ✅ Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (loading) return <CircleLoader />;

    if (error) return <div style={{ color: "red", fontWeight: 'bold' }}>{error}</div>

    return (
        <div className={styles.container}>
            {/* Search Inputs */}
            <div className={styles.searchBar}>
                <div className={styles.searchGroup}>
                    <label className={styles.searchLabel}>
                        Month:
                        <input
                            type="number"
                            placeholder="1-12"
                            value={month}
                            onChange={(e) => {
                                setMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.searchInput}
                        />
                    </label>
                    <label className={styles.searchLabel}>
                        Year:
                        <input
                            type="number"
                            placeholder="e.g. 2026"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.searchInput}
                        />
                    </label>
                </div>

                {/* ✅ Total Amount aligned to the right */}
                <div className={styles.totalAmount}>
                    <strong>Total Amount:</strong> ₹ {formatIndianAmount(totalAmount)}
                </div>
            </div>

            {/* Table */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", cursor: "pointer" }}
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            >
                                <span>Date</span>
                                {sortOrder === "asc" ? (
                                    <ArrowUp size={16} weight="bold" />
                                ) : (
                                    <ArrowDown size={16} weight="bold" />
                                )}
                            </div>
                        </th>
                        <th>Amount</th>
                        <th>To Investment</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((inv, index) => (
                            <tr key={inv._id ?? index}>
                                <td>{startIndex + index + 1}</td>
                                <td>{formatDate(inv.date)}</td>
                                <td>₹ {formatAmount(inv.amount)}</td>
                                <td>{inv.toInvestment}</td>
                                <td>{inv.reason}</td>
                                <td>
                                    <Pencil
                                        size={20}
                                        color="#3498db"
                                        weight="bold"
                                        className={styles.editIcon}
                                        onClick={() => setEditingInvestment(inv)}
                                    />

                                    <Trash
                                        size={20}
                                        color="#e74c3c"
                                        weight="bold"
                                        className={styles.deleteIcon}
                                        onClick={() => dispatch(deleteInvestment(inv._id!))}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center" }}>
                                No records found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ✅ Pagination Buttons */}
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                    >
                        Previous
                    </button>

                    {/* Page numbers with ellipsis */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            // Always show first and last page
                            if (page === 1 || page === totalPages) return true;

                            // Show current page and 2 pages before/after
                            if (page >= currentPage - 2 && page <= currentPage + 2) return true;

                            return false;
                        })
                        .map((page, index, arr) => {
                            const prevPage = arr[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;

                            return (
                                <React.Fragment key={page}>
                                    {showEllipsis && <span className={styles.ellipsis}>...</span>}
                                    <button
                                        className={`${styles.pageButton} ${currentPage === page ? styles.activePage : ""
                                            }`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })}

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* ✅ Popup for messages */}
            {showPopup && (
                <Popup
                    message={message || ""}
                    onClose={() => setShowPopup(false)}
                />
            )}
            {editingInvestment && (
                <EditInvestmentPopup
                    investment={editingInvestment}
                    onClose={() => setEditingInvestment(null)}   // ✅ close popup
                    onSave={(updated) => {
                        // ✅ dispatch update thunk
                        dispatch(updateInvestment(updated))
                            .unwrap()
                            .then(() => {
                                // optional: refresh list if backend doesn’t return updated list
                                dispatch(fetchAllInvestments());
                            })
                            .catch((err) => {
                                console.error("Update failed:", err);
                            });

                        // ✅ close popup after save
                        setEditingInvestment(null);
                    }}
                />
            )}
        </div>
    );
};

export default InvestmentTable;