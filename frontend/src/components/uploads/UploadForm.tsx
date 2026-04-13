import React, { useState } from "react";
import "./UploadForm.css";
import Popup from "../common/Popup";
import { useAppSelector } from "../../hooks";
import CircleLoader from "../common/CircleLoader";

interface UploadFormProps {
  onSubmit: (formData: FormData) => void;
  showPopup: boolean;
  message: string;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, showPopup, message, setShowPopup }) => {
  const [name, setName] = useState("");
  const [comments, setComments] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { loading } = useAppSelector(state => state.uploads);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("comments", comments);
    formData.append("file", file);

    onSubmit(formData);

    setName("");
    setComments("");
    setFile(null);
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
    <div className="upload-form-card">
      <h2 className="form-title">Upload File</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="uploadlabel">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className="uploadInput"
          />
        </div>

        <div className="form-group">
          <label htmlFor="comments" className="uploadlabel">Comments:</label>
          <textarea
            id="comments"
            value={comments}
            placeholder="Add your notes..."
            onChange={(e) => setComments(e.target.value)}
            className="uploadInput"
          />
        </div>

        <div
          className={`form-group drop-zone ${dragActive ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor="file" className="uploadlabel">Choose File:</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="uploadInput"
          />
          <p className="drop-text">Drag & drop a file here, or click to select</p>
          {file && <p className="current-file">Selected file: {file.name}</p>}
        </div>

        <button type="submit" className="submit-btn">Upload Documents</button>
      </form>
      {loading && <CircleLoader />}
      {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default UploadForm;