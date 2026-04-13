import React, { useState } from "react";
import "./UrlForm.css";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { createUrl } from "../../features/urls/urlThunks";
import CircleLoader from "../common/CircleLoader";
import Popup from "../common/Popup";


const UrlForm: React.FC = () => {
    const [url, setUrl] = useState("");
    const [comments, setComments] = useState("");
    const [message, setMessage] = useState<string>('');
    const [showpopup, setShowPopup] = useState<boolean>(false);
    const { loading } = useAppSelector(state => state.urls);

    const dispatch = useAppDispatch();


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(createUrl({ url: url, comments: comments })).unwrap()
            .then(res => {
                setMessage('Url inserted successfully');
                setShowPopup(true);
            }).catch(err => console.error(err))
        setUrl("");
        setComments("");
    };

    return (
        <div className="card">
            <h2 className="card-title">Add Important URL</h2>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="url" className="urlLabel">URL</label>
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="inputField"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="comments" className="urlLabel">Comments</label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter description..."
                        className="inputField"
                    />
                </div>

                <button type="submit" className="btn-submit">
                    Save URL
                </button>
            </form>
            {
                loading && <CircleLoader />
            }
            {
                showpopup && <Popup message={message} onClose={() => setShowPopup(false)} />
            }
        </div>
    );
};

export default UrlForm;