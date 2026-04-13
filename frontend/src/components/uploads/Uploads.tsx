// Uploads.tsx
import React, { useEffect, useState } from "react";
import UploadsCardList from "./UploadsCardList";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteUpload, downloadFiles, fetchUploads, updateUpload, viewFile } from "../../features/uploads/uploadThunks";
import { UploadProps } from "../../features/uploads/uploadsTypes";
import CircleLoader from "../common/CircleLoader";
import Popup from "../common/Popup";
import EditDocumentsForm from "./EditDocumentsForm";
import ViewDocumentPopup from "./ViewDocumentPopup";

export default function Uploads() {
    const dispatch = useAppDispatch();
    const { items, loading } = useAppSelector((state) => state.uploads);

    const [uploadsData, setUploadsData] = useState<UploadProps[]>([]);
    const [editingUpload, setEditingUpload] = useState<UploadProps | null>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [viewingUpload, setViewingUpload] = useState<UploadProps | null>(null);
    const [fileid, setFileId] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    useEffect(() => {
        dispatch(fetchUploads());
    }, [dispatch, showPopup, setShowPopup]);

    useEffect(() => {
        setUploadsData(items);
    }, [items]);

    // Single handler for both selecting and submitting edits
    const handleEdit = (
        arg: string | { name: string; comments: string; file: File | null }
    ) => {
        if (typeof arg === "string") {
            // Called from pencil icon → find upload by id
            const upload = uploadsData.find((u) => u.id === arg);
            if (upload) setEditingUpload(upload);
        } else {
            // Called from form submit → update data
            if (!editingUpload) return;

            // Dispatch update thunk
            dispatch(updateUpload({
                id: editingUpload.id,
                file_id: editingUpload.file_id,
                name: arg.name,
                comments: arg.comments,
                file: arg.file, // may be null if no new file chosen
            }))
                .unwrap()
                .then((updated) => {
                    // ✅ update local state immediately
                    setUploadsData((prev) =>
                        prev.map((u) =>
                            u.id === updated.id ? { ...u, ...updated } : u
                        )
                    );
                    setShowPopup(true);
                    setEditingUpload(null);
                })
                .catch((err) => console.error("Update failed:", err));
        }
    };

    const handleDelete = (id: string) => {
        dispatch(deleteUpload(id))
            .unwrap()
            .then(() => {
                setShowPopup(true);
            })
            .catch((error) => console.error(error));
    };

    const handleDownload = (id: string) => {
        dispatch(downloadFiles(id));
    };

    const handleView = (id: string) => {
        const upload = uploadsData.find((u) => u.file_id === id);
        if (upload) {
            dispatch(viewFile(upload.file_id)).unwrap()
            .then(res=>{
                setFileUrl(res?.fileUrl);
                setFileId(res.fileId);
            })
            setViewingUpload(upload);
        }
    };



    if (loading) return <CircleLoader />;

    return (
        <div>
            <UploadsCardList
                uploads={uploadsData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onView={handleView}
            />

            {showPopup && (
                <Popup
                    message="Edited Documents successfully"
                    onClose={() => setShowPopup(false)}
                />
            )}

            {editingUpload && (
                <EditDocumentsForm
                    onSubmit={handleEdit} // same handler, now dispatches updateUpload
                    onClose={() => setEditingUpload(null)}
                    initialData={{
                        name: editingUpload.name,
                        comments: editingUpload.comments,
                        filename: editingUpload.filename,
                    }}
                />
            )}
            {viewingUpload && (
                <ViewDocumentPopup
                    filename={fileid}
                    fileUrl={fileUrl}
                    onClose={() => setViewingUpload(null)}
                />
            )}


        </div>
    );
}