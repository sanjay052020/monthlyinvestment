import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import { fetchAllInvestments } from "../../features/auth/addInvestmentSlice";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import CircleLoader from "../common/CircleLoader";
import './ReportGenerator.css';


type Status = "form" | "loading" | "success" | "error";

const ReportGenerator: React.FC = () => {
    const [reportType, setReportType] = useState("Sales Report");
    const [category, setCategory] = useState("pending");
    const [format, setFormat] = useState("PDF");
    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [fromDate, setFromDate] = useState(formatDateLocal(firstDayOfMonth));
    const [toDate, setToDate] = useState(formatDateLocal(lastDayOfMonth));



    const [status, setStatus] = useState<Status>("form");

    const dispatch = useAppDispatch();
    const { list, loading, error } = useAppSelector((state: RootState) => state.investment);

    useEffect(() => {
        dispatch(fetchAllInvestments());
    }, [dispatch]);

    if (loading) {
        return <CircleLoader />
    }

    if (error) {
        return <div color="red">Error...</div>
    }

    // Utility function to filter by date range
    const filterByDateRange = (data: any[], from: string, to: string) => {
        const fromTime = new Date(from).getTime();
        const toTime = new Date(to).getTime();
        return data.filter(item => item.status === category).filter(item => {
            const itemDate = new Date(item.date).getTime(); // assuming each investment has a `date` field
            return itemDate >= fromTime && itemDate <= toTime;
        });
    };

    const exportPDF = (data: any[]) => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(14);

        // ✅ Address block
        doc.setFontSize(10);
        const addressLines = [
            "Signifa Sapphire",
            "Flat No 116",
            "7th Cross Road",
            "Kadugudi Post Office",
            "Bangalore, Karnataka 560067"
        ];

        // Print each line with vertical spacing
        let y = 25;
        addressLines.forEach(line => {
            doc.text(line, 14, y);
            y += 6; // spacing between lines
        });

        // Sort data by date ascending
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });

        // ✅ Push table down so it doesn’t overlap address
        autoTable(doc, {
            startY: y + 5,
            head: [["#", "Amount", "ToInvestment", "Reason", "Date"]],
            body: sortedData.map((item, idx) => [
                idx + 1,
                item.amount != null ? `${item.amount}` : "N/A",
                item.toinvestment || "N/A",
                item.reason ?? "N/A",
                item.date ? new Date(item.date).toLocaleDateString("en-GB") : "N/A"
            ]),
        });

        // Dynamic file name
        const fileName = `report_${reportType}_${category}_${fromDate}_to_${toDate}.pdf`;
        doc.save(fileName);
    };


    const exportExcel = (data: any[]) => {
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });
        // ✅ Format data with serial number
        const formattedData = sortedData.map((item, idx) => ({
            ID: idx + 1,
            Amount: item.amount != null ? ` ${item.amount}` : "N/A",
            ToInvestment: item.toinvestment || item.title || "N/A",
            Reason: item.reason ?? "N/A",
            Date: item.date
                ? new Date(item.date).toLocaleDateString("en-GB") // dd/mm/yyyy
                : "N/A"
        }));

        // Convert to worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        // ✅ Dynamic file name
        const fileName = `report_${reportType}_${category}_${fromDate}_to_${toDate}.xlsx`;

        // Trigger download
        XLSX.writeFile(workbook, fileName);
    };

    const exportCSV = (data: any[]) => {
        const sortedData = [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });
        // ✅ Add serial number column
        const formattedData = sortedData.map((item, idx) => ({
            ID: idx + 1,
            Amount: item.amount != null ? ` ${item.amount}` : "N/A",
            ToInvestment: item.toinvestment || item.title || "N/A",
            Reason: item.reason ?? "N/A",
            Date: item.date
                ? new Date(item.date).toLocaleDateString("en-GB")
                : "N/A"
        }));

        // Convert to worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        // ✅ Dynamic file name
        const fileName = `report_${reportType}_${category}_${fromDate}_to_${toDate}.csv`;

        // Trigger download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };


    const handleGenerate = async () => {
        setStatus("loading");

        try {
            const filteredList = filterByDateRange(list, fromDate, toDate);
            await new Promise((resolve, reject) =>
                setTimeout(() => {
                    filteredList.length > 0 && Math.random() > 0.3
                        ? resolve("success")
                        : reject("error");
                }, 2000)
            );

            // ✅ Do NOT export here
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };



    const resetForm = () => {
        setStatus("form");
    };

    const handleDownload = () => {
        const filteredList = filterByDateRange(list, fromDate, toDate);
        if (format === "PDF") {
            exportPDF(filteredList);
        } else if (format === "Excel") {
            exportExcel(filteredList);
        } else if (format === "CSV") {
            exportCSV(filteredList);
        }
    };


    return (
        <div className="report-container">
            {status === "form" && (
                <>
                    <h2>Generate Report</h2>

                    <div className="form-group">
                        <label>Select Report Type</label>
                        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <option >Sales Report</option>
                            <option>Inventory Report</option>
                            <option>Staff Report</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Status</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option>pending</option>
                            <option>completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Format</label>
                        <select value={format} onChange={(e) => setFormat(e.target.value)}>
                            <option>PDF</option>
                            <option>Excel</option>
                            <option>CSV</option>
                        </select>
                    </div>

                    <div className="form-groupreport date-range">
                        <div className="date-field">
                            <label>From Date</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className="date-field">
                            <label>To Date</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="generate-button" onClick={handleGenerate}>
                        Generate Report
                    </button>
                </>
            )}

            {status === "loading" && (
                <div className="status-container">
                    <h3>Generating Report...</h3>
                    <div className="spinner" />
                    <p>Please wait, your report is being generated...</p>
                </div>
            )}

            {status === "success" && (
                <div className="status-container success">
                    <div className="status-icon">&#10004;</div>
                    <h3>Report Generated!</h3>
                    <p>Your report has been successfully created.</p>
                    <div className="status-actions">
                        <button className="primary" onClick={handleDownload}>
                            Download Report
                        </button>
                        <button onClick={resetForm}>Generate New Report</button>
                    </div>
                </div>
            )}



            {status === "error" && (
                <div className="status-container error">
                    <div className="status-icon">&#9888;</div>
                    <h3>Error Occurred!</h3>
                    <p>Failed to generate the report. Please try again.</p>
                    <div className="status-actions">
                        <button onClick={handleGenerate}>Retry</button>
                        <button onClick={resetForm} className="cancel">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;