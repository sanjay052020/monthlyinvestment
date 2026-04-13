import React, { useState } from "react";
import { PencilSimple, Trash, Check, X } from "phosphor-react";
import "./UserContactTable.css";
import Pagination from "../dashboard/Pagination";
import { Address, Props, UserContact } from "./userContact";



const UserContactTable: React.FC<Props> = ({ contacts, onEditSave, onDelete, query }) => {
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editData, setEditData] = useState<UserContact | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const handleEditClick = (contact: UserContact) => {
        setEditRowId(contact?.userid || "");
        setEditData({ ...contact });
    };

    const handleCancel = () => {
        setEditRowId(null);
        setEditData(null);
    };

    const handleSave = () => {
        if (editData) {
            onEditSave(editData);
        }
        setEditRowId(null);
        setEditData(null);
    };

    const handleChange = (field: keyof UserContact | keyof Address, value: string) => {
        if (editData) {
            if (field in editData.address) {
                setEditData({
                    ...editData,
                    address: { ...editData.address, [field]: value },
                });
            } else {
                setEditData({ ...editData, [field as keyof UserContact]: value });
            }
        }
    };

    // Filter contacts
    const filteredContacts = (contacts || []).filter((contact) => {
        const name = contact?.name?.toLowerCase() || "";
        const mobile = contact?.mobile || "";
        const term = query?.toLowerCase() || "";
        return name.includes(term) || mobile.includes(query || "");
    });

    // Pagination
    const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

    return (
        <div>
            <table className="contact-table">
                <thead>
                    <tr>
                        <th>Sr.No.</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>City</th>
                        <th>State</th>
                        <th>PIN</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedContacts.map((contact, index) => (
                        <tr key={contact.userid || contact.mobile}>
                            {editRowId === contact.userid ? (
                                <>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{contact.userid}</td>
                                    <td><input value={editData?.name || ""} onChange={(e) => handleChange("name", e.target.value)} /></td>
                                    <td><input value={editData?.mobile || ""} onChange={(e) => handleChange("mobile", e.target.value)} /></td>
                                    <td><input value={editData?.address.city || ""} onChange={(e) => handleChange("city", e.target.value)} /></td>
                                    <td><input value={editData?.address.state || ""} onChange={(e) => handleChange("state", e.target.value)} /></td>
                                    <td><input value={editData?.address.pin || ""} onChange={(e) => handleChange("pin", e.target.value)} /></td>
                                    <td className="actions">
                                        <Check size={22} className="icon save-icon" onClick={handleSave} />
                                        <X size={22} className="icon cancel-icon" onClick={handleCancel} />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{contact.userid}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.mobile}</td>
                                    <td>{contact.address.city}</td>
                                    <td>{contact.address.state}</td>
                                    <td>{contact.address.pin}</td>
                                    <td className="actions">
                                        <PencilSimple size={20} className="icon edit-icon" onClick={() => handleEditClick(contact)} />
                                        <Trash size={20} className="icon delete-icon" onClick={() => onDelete(contact.userid || "")} />
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};

export default UserContactTable;
