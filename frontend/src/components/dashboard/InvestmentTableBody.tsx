import React from "react";
import styles from "./InvestmentTable.module.css";
import { Investment } from "../../features/auth/addInvestmentSlice";
import { formatAmount, formatDate, formatIndianAmount } from "../../utils/formatAmount";
import { Trash, Pencil, ArrowUp, ArrowDown } from "phosphor-react";

interface InvestmentTableBodyProps {
  currentData: Investment[];
  startIndex: number;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  onEdit: (investment: Investment) => void;
  onDelete: (id: string) => void;
}

const InvestmentTableBody: React.FC<InvestmentTableBodyProps> = ({
  currentData,
  startIndex,
  sortOrder,
  setSortOrder,
  onEdit,
  onDelete,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Sr.No</th>
          <th>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer",
              }}
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
            <tr key={inv.investment_id ?? index}>
              <td>{startIndex + index + 1}</td>
              <td>{formatDate(inv.date)}</td>
              <td>₹ {formatIndianAmount(inv.amount)}</td>
              <td>{inv.toinvestment}</td>
              <td>{inv.reason}</td>
              <td>
                <Pencil
                  size={20}
                  color="#3498db"
                  weight="bold"
                  className={styles.editIcon}
                  onClick={() => onEdit(inv)}
                />
                <Trash
                  size={20}
                  color="#e74c3c"
                  weight="bold"
                  className={styles.deleteIcon}
                  onClick={() => onDelete(inv.investment_id!)}
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
  );
};

export default InvestmentTableBody;