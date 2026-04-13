// EditDocumentsForm.tsx
import React, { useState } from "react";
import "./EditDocumentsForm.css";

interface EditDocumentsFormProps {
  onSubmit: (data: { name: string; comments: string; file: File | null }) => void;
  onClose: () => void;
  initialData?: { name: string; comments: string; filename?: string };
}

const EditDocumentsForm: React.FC<EditDocumentsFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [comments, setComments] = useState(initialData?.comments || "");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, comments, file });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <form className="edit-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Edit Document</h2>

          <div className="form-group">
            <label htmlFor="name" className="editLabel">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="editDocumentField"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comments" className="editLabel">Comments</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="editDocumentField"
            />
          </div>

          <div
            className={`form-group drop-zone ${dragActive ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="file" className="editLabel">Upload New File</label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="editDocumentField"
            />
            <p className="drop-text">Drag & drop a file here, or click to select</p>
            {file && <p className="current-file">Selected file: {file.name}</p>}
            {initialData?.filename && !file && (
              <p className="current-file">Current file: {initialData.filename}</p>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentsForm;