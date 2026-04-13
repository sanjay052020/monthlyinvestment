import React, { useState } from "react";
import { UploadProps } from "../../features/uploads/uploadsTypes";
import UploadsTable from "./UploadsTable";
import "./UploadsCardList.css";
import SearcComponent from "../SearchComponent";

interface UploadsCardListProps {
  uploads: UploadProps[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onView: (id: string) => void;
}

const UploadsCardList: React.FC<UploadsCardListProps> = ({
  uploads,
  onEdit,
  onDelete,
  onDownload,
  onView
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [query, setQuery] = useState("");
  return (
    <div className="card">
      <div className="uploadtitle">Uploads Documents Dashboard</div>
      <SearcComponent query={query} setQuery={setQuery} placeHolder="Search documents by name or filename"/>
      <UploadsTable
        query={query}
        uploads={uploads}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onEdit={onEdit}
        onDelete={onDelete}
        onDownload={onDownload}
        onView={onView}
      />
    </div>
  );
};

export default UploadsCardList;