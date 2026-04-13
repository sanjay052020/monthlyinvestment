import React from "react";
import "./ViewDocumentPopup.css";

interface ViewDocumentPopupProps {
  filename?: string;
  fileUrl: string;   // ✅ blob URL or API path
  onClose: () => void;
}

const ViewDocumentPopup: React.FC<ViewDocumentPopupProps> = ({ filename, fileUrl, onClose }) => {
  const isImage = filename?.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = filename?.match(/\.pdf$/i);
  const normalizedUrl = fileUrl.replace(/\\/g, "/");

  return (
    <div className="modal-overlay">
      <div className="modal-card large">
        <h2 className="form-title">Document Viewer</h2>

        <div className="file-preview">
          {isImage && <img src={normalizedUrl} alt={filename} className="preview-img" />}
          {isPDF && (
            <iframe
              src={normalizedUrl}
              title="PDF Preview"
              className="preview-pdf"
            />
          )}
          {!isImage && !isPDF && (
            <iframe
              src={normalizedUrl}
              title="File Preview"
              className="preview-generic"
            />
          )}
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentPopup;