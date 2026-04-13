import React from "react";
import styles from "./SearchComponent.module.css";

interface LoanSearchProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
}

const SearcComponent: React.FC<LoanSearchProps> = ({ query, setQuery, placeHolder }) => (
  <div className={styles.searchWrapper}>
    <fieldset className="inputGroupWrapper">
      <legend className="groupLegend">Search Inputs..</legend>

      <input
        type="text"
        placeholder={placeHolder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
    </fieldset>
  </div>
);

export default SearcComponent;