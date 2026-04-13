import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import "./UserContactForm.css";
import { AppDispatch, RootState } from "../../store";
import { createUserContact } from "../../features/usercontact/userContactSlice";
import Popup from "../Popup";
import { UserContact } from "./userContact";

// Validation schema
const schema = yup.object({
    name: yup.string().required("Name is required"),
    mobile: yup
        .string()
        .matches(/^[0-9]{10}$/, "Mobile must be a 10-digit number")
        .required("Mobile is required"),
    address: yup.object({
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        pin: yup
            .string()
            .matches(/^[0-9]{6}$/, "PIN must be a 6-digit number")
            .required("PIN is required"),
    }),
});



const UserContactForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector(
        (state: RootState) => state.userContact
    );
    const [msg, setMsg] = useState("");
    const { register, handleSubmit, formState: { errors }, reset } = useForm<UserContact>({
        resolver: yupResolver(schema),
    });
    const [showPopup, setShowPopup] = useState(false);

    const onSubmit = async (data: UserContact) => {
        try {
            const result = await dispatch(createUserContact(data)).unwrap();
            if (result && result?.lastMessage) {
                setMsg(result?.message);
            } else {
                setMsg("Contact created successfully");
            }

            setShowPopup(true);
            reset();
        } catch (err: any) {
            if (err?.message) {
                setMsg("Duplicate Mobile Number..");
                setShowPopup(true);
            }
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <div className="title">User Contact Form</div>

            <div className="form-group">
                <label className="userlable">Name</label>
                <input {...register("name")} className="userinput" />
                <span className="error">{errors.name?.message}</span>
            </div>

            <div className="form-group">
                <label className="userlable">Mobile</label>
                <input {...register("mobile")} maxLength={10} className="userinput"/>
                <span className="error">{errors.mobile?.message}</span>
            </div>

            <div className="form-group">
                <label className="userlable">City</label>
                <input {...register("address.city")} className="userinput"/>
                <span className="error">{errors.address?.city?.message}</span>
            </div>

            <div className="form-group">
                <label className="userlable">State</label>
                <input {...register("address.state")} className="userinput"/>
                <span className="error">{errors.address?.state?.message}</span>
            </div>

            <div className="form-group">
                <label className="userlable">PIN</label>
                <input {...register("address.pin")} maxLength={6} className="userinput"/>
                <span className="error">{errors.address?.pin?.message}</span>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {showPopup && (
                <Popup
                    message={msg || "Duplicate Mobile Number."}
                    onClose={() => setShowPopup(false)}
                />
            )}
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default UserContactForm;