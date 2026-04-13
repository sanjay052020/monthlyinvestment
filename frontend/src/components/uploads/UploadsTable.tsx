import React from "react";
import { PencilSimple, Trash, DownloadSimple, Eye } from "phosphor-react";
import { UploadProps } from "../../features/uploads/uploadsTypes";
import Pagination from "../dashboard/Pagination";
import "./UploadsCardList.css";

interface UploadsTableProps {
    uploads: UploadProps[];
    currentPage: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onDownload: (id: string) => void;
    onView: (id: string) => void;
    query: string;
}

const UploadsTable: React.FC<UploadsTableProps> = ({
    uploads,
    currentPage,
    rowsPerPage,
    onPageChange,
    onEdit,
    onDelete,
    onDownload,
    onView,
    query
}) => {
    const totalPages = Math.ceil(uploads.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const normalizedQuery = query.toLowerCase();
    const filteredLoans = uploads.filter((uploads: UploadProps) => {
        const filename = uploads.filename?.toLowerCase() || "";
        const name = uploads.name?.toLowerCase() || "";
        return filename.includes(normalizedQuery) || name.includes(normalizedQuery);
    });
    const currentData = filteredLoans.slice(startIndex, startIndex + rowsPerPage);
    return (
        <>
            <table className="uploads-table">
                <thead>
                    <tr>
                        <th className="srno-col">Sr. No</th>
                        <th>Name</th>
                        <th>Comments</th>
                        <th>Filename</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="no-data">
                                No uploads found
                            </td>
                        </tr>
                    ) : (
                        currentData.map((upload, index) => (
                            <tr key={upload.id} className="upload-card-row">
                                <td className="srno-col">{startIndex + index + 1}</td>
                                <td>{upload.name}</td>
                                <td>{upload.comments}</td>
                                <td>{upload.filename}</td>
                                <td className="actions">
                                    <button
                                        className="icon-btn edit"
                                        onClick={() => onEdit(upload.id)}
                                        title="Edit Documents"
                                    >
                                        <PencilSimple size={20} weight="bold" />
                                    </button>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() => onDelete(upload.id)}
                                        title="Delete Documents"
                                    >
                                        <Trash size={20} weight="bold" />
                                    </button>
                                    <button
                                        className="icon-btn download"
                                        onClick={() => onDownload(upload.file_id)}
                                        title="Download File"
                                    >
                                        <DownloadSimple size={20} weight="bold"/>
                                    </button>
                                    <button
                                        className="icon-btn download"
                                        onClick={() => onView(upload.file_id)}
                                        title="View File"
                                    >
                                        <Eye size={20} weight="bold"/>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </>
    );
};

export default UploadsTable;