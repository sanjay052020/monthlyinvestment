import React, { useState } from "react";
import { PencilSimple, Trash, Check, X } from "phosphor-react";
import "./UserContactTable.css";

interface UserContact {
    user_id?: string;
    name: string;
    mobile: string;
    address: string;
    state: string;
    city: string;
    pin: string;
    _id?: string;
}

interface Props {
    contacts: UserContact[];
    onEditSave: (contact: UserContact) => void;
    onDelete: (userId: string) => void;
}

const UserContactTable: React.FC<Props> = ({ contacts, onEditSave, onDelete }) => {
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editData, setEditData] = useState<UserContact | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");


    const handleEditClick = (contact: UserContact) => {
        setEditRowId(contact.user_id || "");
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

    const handleChange = (field: keyof UserContact, value: string) => {
        if (editData) {
            setEditData({ ...editData, [field]: value });
        }
    };

    // Filter contacts by name or mobile
    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.mobile.includes(searchTerm)
    );



    return (
        <div className="table-container">
            <h2 className="table-title">User Contact List</h2>
            <fieldset className="inputGroupWrapperContact">
                <legend className="groupLegendContact">Search Input</legend>
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search by name or mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </fieldset>

            <table className="contact-table">
                <thead>
                    <tr>
                        <th>Sr.No.</th>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>State</th>
                        <th>City</th>
                        <th>PIN</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map((contact, index) => (
                        <tr key={contact.user_id || contact.mobile}>
                            {editRowId === contact.user_id ? (
                                <>
                                    <td>{index + 1}</td>
                                    <td>{contact.user_id}</td>
                                    <td><input value={editData?.name || ""} onChange={(e) => handleChange("name", e.target.value)} /></td>
                                    <td><input value={editData?.mobile || ""} onChange={(e) => handleChange("mobile", e.target.value)} /></td>
                                    <td><input value={editData?.address || ""} onChange={(e) => handleChange("address", e.target.value)} /></td>
                                    <td><input value={editData?.state || ""} onChange={(e) => handleChange("state", e.target.value)} /></td>
                                    <td><input value={editData?.city || ""} onChange={(e) => handleChange("city", e.target.value)} /></td>
                                    <td><input value={editData?.pin || ""} onChange={(e) => handleChange("pin", e.target.value)} /></td>
                                    <td className="actions">
                                        <Check size={22} className="icon save-icon" onClick={handleSave} />
                                        <X size={22} className="icon cancel-icon" onClick={handleCancel} />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{index + 1}</td>
                                    <td>{contact.user_id}</td>
                                    <td>{contact.name}</td>
                                    <td>{contact.mobile}</td>
                                    <td>{contact.address}</td>
                                    <td>{contact.state}</td>
                                    <td>{contact.city}</td>
                                    <td>{contact.pin}</td>
                                    <td className="actions">
                                        <PencilSimple size={20} className="icon edit-icon" onClick={() => handleEditClick(contact)} />
                                        <Trash size={20} className="icon delete-icon" onClick={() => contact._id && onDelete(contact._id)} />
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserContactTable;