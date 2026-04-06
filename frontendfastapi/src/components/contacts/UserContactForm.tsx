import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import "./UserContactForm.css";
import { AppDispatch, RootState } from "../../store";
import { createUserContact, fetchUserContactByMobile } from "../../features/usercontact/userContactSlice";
import Popup from "../Popup";

// Define the shape of the form data
interface UserContact {
    name: string;
    mobile: string;
    address: string;
    state: string;
    city: string;
    pin: string;
    investment_id?: string
}

// Validation schema
const schema = yup.object({
    name: yup.string().required("Name is required"),
    mobile: yup
        .string()
        .matches(/^[0-9]{10}$/, "Mobile must be a 10-digit number")
        .required("Mobile is required"),
    address: yup.string().required("Address is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    pin: yup
        .string()
        .matches(/^[0-9]{6}$/, "PIN must be a 6-digit number")
        .required("PIN is required"),
});

const UserContactForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, lastMessage } = useSelector(
        (state: RootState) => state.userContact
    );
    const [msg, setMsg] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserContact>({
        resolver: yupResolver(schema),
    });
    const [showPopup, setShowPopup] = useState(false);
    const onSubmit = async (data: UserContact) => {
        try {
            debugger
            // First check if mobile exists
            const existingUser = await dispatch(fetchUserContactByMobile(data.mobile)).unwrap();

            if (existingUser) {
                // Show error inline and stop submission
                setShowPopup(true);
                setMsg("This mobile number is already registered.")
                return;
            }

            // If not duplicate, proceed to create
            await dispatch(createUserContact(data)).unwrap();
            setShowPopup(true);
            reset();
        } catch (error: any) {
            console.error("Unexpected error:", error.message);
        }
    };



    return (
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
            <div className="title">User Contact Form</div>

            <div className="form-group">
                <label>Name</label>
                <input {...register("name")} />
                <span className="error">{errors.name?.message}</span>
            </div>

            <div className="form-group">
                <label>Mobile</label>
                <input {...register("mobile")} maxLength={10} />
                <span className="error">{errors.mobile?.message}</span>
            </div>

            <div className="form-group">
                <label>Address</label>
                <input {...register("address")} />
                <span className="error">{errors.address?.message}</span>
            </div>

            <div className="form-group">
                <label>State</label>
                <input {...register("state")} />
                <span className="error">{errors.state?.message}</span>
            </div>

            <div className="form-group">
                <label>City</label>
                <input {...register("city")} />
                <span className="error">{errors.city?.message}</span>
            </div>

            <div className="form-group">
                <label>PIN</label>
                <input {...register("pin")} />
                <span className="error">{errors.pin?.message}</span>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {showPopup && lastMessage && <Popup
                message={lastMessage ?? msg}
                onClose={() => setShowPopup(false)}
            />}
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default UserContactForm;