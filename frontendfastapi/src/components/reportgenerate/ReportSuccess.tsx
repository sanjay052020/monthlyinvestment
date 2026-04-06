import React from "react";
import "./ReportStatus.css";

const ReportSuccess: React.FC = () => {
  return (
    <div className="status-container success">
      <div className="status-icon">&#10004;</div>
      <h3>Report Generated!</h3>
      <p>Your report has been successfully created.</p>
      <div className="status-actions">
        <button className="primary">Download Report</button>
        <button>Generate New Report</button>
      </div>
    </div>
  );
};

export default ReportSuccess;