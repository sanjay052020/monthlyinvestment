import React from "react";
import "./ReportStatus.css";

const ReportLoading: React.FC = () => {
  return (
    <div className="status-container">
      <h3>Generating Report...</h3>
      <div className="spinner" />
      <p>Please wait, your report is being generated...</p>
    </div>
  );
};

export default ReportLoading;