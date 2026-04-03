import React, { useEffect, useState } from "react";
import styles from "./InvestmentTable.module.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearMessage, deleteInvestment, fetchAllInvestments, Investment, updateInvestment } from "../../features/auth/addInvestmentSlice";
import { RootState } from "../../store";
import EditInvestmentPopup from "./EditInvestmentPopup";
import { sortedDataMethod } from "../../utils/sortData";
import InvestmentTableHeader from "./InvestmentTableHeader";
import InvestmentTableBody from "./InvestmentTableBody";
import Pagination from "./Pagination";
import Popup from "../common/Popup";
import CircleLoader from "../common/CircleLoader";

interface InvestmentTableProps {
    statusFilter?: "completed" | "pending" | "in-progress";
}

const InvestmentTable: React.FC<InvestmentTableProps> = ({ statusFilter = "completed" }) => {
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");

    const rowsPerPage = 10;
    const dispatch = useAppDispatch();
    const { list, loading, message, error } = useAppSelector((state: RootState) => state.investment);

    // Fetch investments on mount
    useEffect(() => {
        dispatch(fetchAllInvestments());
        setShowPopup(false);
    }, [dispatch]);

    // Show popup when message changes
    useEffect(() => {
        if (message) {
            setShowPopup(true);

            // Auto-close after 3 seconds
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 3000);

            // Cleanup to avoid memory leaks
            return () => clearTimeout(timer);
        }
    }, [message]);



    // Filter data by month/year and toInvestment search
    const filteredData =
        list?.filter((item) => {
            const itemDate = new Date(item.date);
            const itemMonth = (itemDate.getMonth() + 1).toString();
            const itemYear = itemDate.getFullYear().toString();

            const matchesMonthYear =
                (month ? itemMonth === month : true) &&
                (year ? itemYear === year : true);

            const matchesSearch =
                searchTerm ? item.toInvestment.toLowerCase().includes(searchTerm.toLowerCase()) : true;

            return matchesMonthYear && matchesSearch;
        }) || [];

    // Calculate total amount for selected status = "completed"
    const totalAmount = filteredData
        .filter((item) => item.status?.toLowerCase() === "completed")
        .reduce((sum, inv) => sum + Number(inv.amount), 0);



    // Get system current month/year
    const now = new Date();
    const currentMonth = (now.getMonth() + 1).toString(); // months are 0-based
    const currentYear = now.getFullYear().toString();

    // Calculate total amount for current system month
    const systemMonthAmount = list
        ?.filter((item) => {
            const itemDate = new Date(item.date);
            const itemMonth = (itemDate.getMonth() + 1).toString();
            const itemYear = itemDate.getFullYear().toString();

            return itemMonth === currentMonth && itemYear === currentYear;
        })
        .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

    // Calculate total pending amount
    const pendingAmount = list
        ?.filter((item) => item.status?.toLowerCase() === "pending")
        .reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

    // Sort data
    const sortedData = sortedDataMethod(filteredData, sortOrder);

    // Pagination
    const totalPages = Math.ceil(
        sortedData.filter((item) => item.status?.toLowerCase() === statusFilter.toLowerCase()).length / rowsPerPage
    );
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = sortedData
        .filter((item) => item.status?.toLowerCase() === statusFilter.toLowerCase())
        .slice(startIndex, startIndex + rowsPerPage);

    if (loading) return <CircleLoader />;
    if (error) return <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>;

    return (
        <div className={styles.container}>
            <InvestmentTableHeader
                month={month}
                year={year}
                setMonth={setMonth}
                setYear={setYear}
                totalAmount={totalAmount}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                systemMonthAmount={systemMonthAmount}
                pendingAmount={pendingAmount}
            />

            <InvestmentTableBody
                currentData={currentData}
                startIndex={startIndex}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onEdit={setEditingInvestment}
                onDelete={(id) => dispatch(deleteInvestment(id))}
            />

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {showPopup && <Popup message={message || ""} onClose={() => setShowPopup(false)} />}
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
                        dispatch(clearMessage())
                    }}
                />
            )}
        </div>
    );
};

export default InvestmentTable;