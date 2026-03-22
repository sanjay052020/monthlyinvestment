import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchUserContacts,
  updateUserContact,
  deleteUserContact,
} from "../../features/usercontact/userContactSlice";
import UserContactTable from "./UserContactTable";
import Popup from "../common/Popup";

const UserContactList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, loading, error } = useSelector(
    (state: RootState) => state.userContact
  );

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    // Fetch all user contacts when component mounts
    dispatch(fetchUserContacts());
  }, [dispatch]);

  // Save edited contact
  const handleEditSave = (contact: any) => {
    const { _id, user_id, ...contactData } = contact;
    if (_id) {
      dispatch(updateUserContact({ userId: _id, contactData }))
        .unwrap()
        .then(() => {
          setPopupMessage("Contact updated successfully");
          setShowPopup(true);
          // Refresh list after update
          dispatch(fetchUserContacts());
        })
        .catch((err) => {
          setPopupMessage("Failed to update contact: " + err);
          setShowPopup(true);
        });
    }
  };

  // Delete contact
  const handleDelete = (contactId: string) => {
    dispatch(deleteUserContact(contactId))
      .unwrap()
      .then(() => {
        setPopupMessage("Contact deleted successfully");
        setShowPopup(true);
        // Refresh list after delete
        dispatch(fetchUserContacts());
      })
      .catch((err) => {
        setPopupMessage("Failed to delete contact: " + err);
        setShowPopup(true);
      });
  };

  if (loading) return <p>Loading contacts...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <UserContactTable
        contacts={contacts}
        onEditSave={handleEditSave}
        onDelete={handleDelete}
      />
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default UserContactList;