import React, { useState } from "react";
import "./EditDocumentsForm.css";
import EditDocumentsForm from "./EditDocumentsForm";

interface FormData {
  name: string;
  comments: string;
  file: File | null;
}

const EditDocumentsPage: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    setSubmittedData(data);
    setIsEditing(false); // close popup after save
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="parent-container">
      <button className="open-edit-btn" onClick={handleOpenEdit}>
        Edit Document
      </button>

      {isEditing && (
        <EditDocumentsForm
          onSubmit={handleFormSubmit}
          onClose={handleCloseEdit}   // add onClose prop to form
          initialData={submittedData || { name: "", comments: "" }} // pre-fill if available
        />
      )}

      {submittedData && (
        <div className="preview-card">
          <h3>Preview</h3>
          <p><strong>Name:</strong> {submittedData.name}</p>
          <p><strong>Comments:</strong> {submittedData.comments}</p>
          {submittedData.file && (
            <p>
              <strong>File:</strong> {submittedData.file.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditDocumentsPage;