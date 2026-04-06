import React from "react";
import "./ReportStatus.css";

const ReportError: React.FC = () => {
  return (
    <div className="status-container error">
      <div className="status-icon">&#9888;</div>
      <h3>Error Occurred!</h3>
      <p>Failed to generate the report. Please try again.</p>
      <div className="status-actions">
        <button>Retry</button>
        <button className="cancel">Cancel</button>
      </div>
    </div>
  );
};

export default ReportError;