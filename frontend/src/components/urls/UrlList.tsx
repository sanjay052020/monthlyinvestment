import React, { useEffect, useState } from "react";
import { PencilSimple, Trash, Check, X } from "phosphor-react";
import "./UrlList.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteUrl, fetchUrls, updateUrl } from "../../features/urls/urlThunks";
import CircleLoader from "../common/CircleLoader";
import Popup from "../common/Popup";

const UrlList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector((state) => state.urls);

    const [message, setMessage] = useState<string>("");
    const [showPopup, setShowPopup] = useState<boolean>(false);

    // Track which row is being edited
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const [editUrl, setEditUrl] = useState<string>("");
    const [editComments, setEditComments] = useState<string>("");

    useEffect(() => {
        dispatch(fetchUrls());
    }, [dispatch]);

    const handleEdit = (id: string, url: string, comments?: string) => {
        setEditRowId(id);
        setEditUrl(url);
        setEditComments(comments || "");
    };

    const handleCancelEdit = () => {
        setEditRowId(null);
        setEditUrl("");
        setEditComments("");
    };

    const handleSaveEdit = (id: string) => {
        dispatch(updateUrl({ id, data: { url: editUrl, comments: editComments } }))
            .unwrap()
            .then(() => {
                setShowPopup(true);
                setMessage("URL updated successfully");
                handleCancelEdit();
            });
    };

    const handleDelete = (id: string) => {
        dispatch(deleteUrl(id))
            .unwrap()
            .then(() => {
                setShowPopup(true);
                setMessage("URL deleted successfully");
            });
    };

    return (
        <div className="url-card">
            <h2 className="url-title">URLs Dashboard</h2>
            {loading && <CircleLoader />}
            <table className="url-table">
                <thead>
                    <tr>
                        <th className="urlsrno">Sr. No.</th>
                        <th className="urlColumn">URL</th>
                        <th>Comments</th>
                        <th className="urlaction">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="no-data">
                                No data found...
                            </td>
                        </tr>
                    ) : (
                        items.map((u, index) => (
                            <tr key={u.id}>
                                <td className="urlsrno">{index + 1}</td>
                                <td>
                                    {editRowId === u.id ? (
                                        <input
                                            type="url"
                                            value={editUrl}
                                            onChange={(e) => setEditUrl(e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <a href={u.url} target="_blank" rel="noopener noreferrer" className="urlColumn">
                                            {u.url}
                                        </a>
                                    )}
                                </td>
                                <td>
                                    {editRowId === u.id ? (
                                        <input
                                            type="text"
                                            value={editComments}
                                            onChange={(e) => setEditComments(e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        u.comments || "-"
                                    )}
                                </td>
                                <td className="actions-cell">
                                    {editRowId === u.id ? (
                                        <>
                                            <button
                                                className="action-btn save-btn"
                                                onClick={() => handleSaveEdit(u.id)}
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                className="action-btn cancel-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="urlaction">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => handleEdit(u.id, u.url, u.comments)}
                                            >
                                                <PencilSimple size={18} />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(u.id)}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}
        </div>
    );
};

export default UrlList;