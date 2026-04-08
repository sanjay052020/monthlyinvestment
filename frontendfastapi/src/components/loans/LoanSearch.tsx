import React from "react";
import styles from "./LoanSearch.module.css";

interface LoanSearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const LoanSearch: React.FC<LoanSearchProps> = ({ query, setQuery }) => (
  <div className={styles.searchWrapper}>
    <fieldset className="inputGroupWrapper">
      <legend className="groupLegend">Search Inputs..</legend>

      <input
        type="text"
        placeholder="Search by Borrower ID or Name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
    </fieldset>
  </div>
);

export default LoanSearch;