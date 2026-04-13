import React, { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { saveUpload } from "../../features/uploads/uploadThunks";
import UploadForm from "./UploadForm";

const UploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPopup, setShowpopup] = useState(false);
  const [message, setMessage] = useState<string>('');
  const handleUpload = (formData: FormData) => {
    const name = formData.get("name") as string;
    const comments = formData.get("comments") as string;
    const file = formData.get("file") as File;

    if (!name || !comments || !file) {
      console.error("Invalid form data");
      return;
    }

    // Dispatch thunk with correct payload type
    dispatch(saveUpload({ name, comments, file })).unwrap()
    .then((res)=>{
        setShowpopup(true);
        setMessage(`File Uploaded Successfully. ID: ${res.id}`);
    })
  };

  return <UploadForm onSubmit={handleUpload} showPopup={showPopup} setShowPopup={setShowpopup} message={message}/>;
};

export default UploadPage;