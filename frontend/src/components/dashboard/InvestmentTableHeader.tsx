import React from "react";
import styles from "./InvestmentTable.module.css";
import { formatIndianAmount } from "../../utils/formatAmount";

interface InvestmentTableHeaderProps {
  month: string;
  year: string;
  setMonth: (value: string) => void;
  setYear: (value: string) => void;
  totalAmount: number;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const InvestmentTableHeader: React.FC<InvestmentTableHeaderProps> = ({
  month,
  year,
  setMonth,
  setYear,
  totalAmount,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className={styles.searchBar}>
      <fieldset className={styles.inputGroupWrapper}>
        <legend className={styles.groupLegend}>Filters</legend>

        <label className={styles.searchLabel}>
          Month:
          <input
            type="number"
            placeholder="1-12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={styles.searchInput}
          />
        </label>

        <label className={styles.searchLabel}>
          Year:
          <input
            type="number"
            placeholder="e.g. 2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={styles.searchInput}
          />
        </label>

        <label className={styles.searchLabel}>
          Search:
          <input
            type="text"
            placeholder="Search by investment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </label>
      </fieldset>
      <fieldset className={styles.inputGroupWrapper}>
        <legend className={styles.groupLegend}>Total Amount</legend>
        <div className={styles.totalAmount}>
          <strong>Total Amount:</strong> ₹ {formatIndianAmount(totalAmount)}
        </div>
      </fieldset>
    </div>
  );
};

export default InvestmentTableHeader;