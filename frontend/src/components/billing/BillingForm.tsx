import React, { useEffect, useState } from "react";
import Select from "react-select";
import { User } from "phosphor-react";
import "./BillingForm.css";
import { useAppDispatch } from "../../hooks";
import { createBill } from "../../features/billing/billingSlice";
import productData from "../../data/products.json";
import CircleLoader from "../CircleLoader";
import Popup from "../Popup";
import paymentOptions from "../../data/paymentOptions.json";
import ProductRow from "./ProductRow";

export interface Product {
    name: string;
    productId: string;
    qty: number;
    rate: number;
    weight: string;
}

export const BillingForm: React.FC = () => {
    const dispatch = useAppDispatch();
    let getUserEmail = localStorage.getItem("userEmail") || "";

    const [billingPerson, setBillingPerson] = useState(getUserEmail);
    const [modeOfPayment, setModeOfPayment] = useState("");
    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPopup, setShowPopup] = useState(false);
    const [products, setProducts] = useState<Product[]>([
        { name: "", productId: "", qty: 0, rate: 0, weight: "" }
    ]);
    const [countProduct, setCountProduct] = useState('');
    const [totalAmt, setTotalAmt] = useState(0.0);

    const addProduct = () => {
        setProducts([
            ...products,
            { name: "", productId: "", qty: 0, rate: 0, weight: "" }
        ]);
    };
    const updateProduct = <K extends keyof Product>(
        index: number,
        field: K,
        value: Product[K]
    ) => {
        const updated = [...products];
        updated[index][field] = value;
        setProducts(updated);

        // clear error if valid
        const key = `product-${field}-${index}`;
        setErrors((prev) => {
            if (prev[key]) {
                if (typeof value === "string" && value.trim() !== "") {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                }
                if (typeof value === "number" && value > 0) {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                }
            }
            return prev;
        });
    };

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!billingPerson.trim()) {
            newErrors.billingPerson = "Billing person is required.";
        }
        if (!modeOfPayment.trim()) {
            newErrors.modeOfPayment = "Mode of payment is required.";
        }

        products.forEach((p, i) => {
            if (!p.name.trim()) newErrors[`product-name-${i}`] = "Product name is required.";
            if (!p.productId.trim()) newErrors[`product-id-${i}`] = "Product id is required.";
            if (p.qty <= 0) newErrors[`product-qty-${i}`] = "Qty must be greater than 0.";
            if (p.rate <= 0) newErrors[`product-rate-${i}`] = "Rate must be greater than 0.";
            if (!p.weight.trim()) newErrors[`product-weight-${i}`] = "Weight is required.";
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoader(true);

        const payload = {
            billing_person: billingPerson,
            mode_of_payment: modeOfPayment,
            products: products.map((p) => ({
                ...p,
                weight: p.weight ? `${p.weight} kg` : ""
            }))
        };

        const resultAction = await dispatch(createBill(payload));
        if (createBill.fulfilled.match(resultAction)) {
            setTotalAmt(resultAction?.payload?.total || 0);
            setCountProduct(resultAction.payload.billing_id);
            setShowPopup(true);

            // reset form
            setModeOfPayment("");
            setProducts([{ name: "", productId: "", qty: 0, rate: 0, weight: "" }]);
        }
        setLoader(false);
    };

    const productOptions = productData.map((p) => ({
        value: p.productId,
        label: p.name,
        productId: p.productId
    }));

    const popupMsg = `Bill No. - ${countProduct} || Total Amount - ${totalAmt.toFixed(2)}`;
    useEffect(() => {
        setShowPopup(false)
    }, [])

    const isProductFill = (product: Product) => {
        return (
            product.name.trim() !== "" &&
            product.productId.trim() !== "" &&
            product.productId.trim() !== "" &&
            product.qty > 0 &&
            product.rate > 0 &&
            product.weight.trim() !== ""
        );
    };

    const handleFieldChange = (
        fieldKey: string,
        value: string | number,
        updater?: () => void
    ) => {
        if (updater) updater();

        setErrors((prev) => {
            if (prev[fieldKey] && String(value).trim() !== "" && value !== 0) {
                const { [fieldKey]: _, ...rest } = prev;
                return rest;
            }
            return prev;
        });
    };

    return (
        <form className="billing-form" onSubmit={handleSubmit}>
            <h2 className="title">Create Customer Billing</h2>
            {loader && <CircleLoader />}

            <div className="form-group">
                <label className="inputLabel">
                    <span className="label-icon">
                        <User size={20} color="blue" /> Billing Person
                    </span>
                </label>
                <input
                    type="text"
                    value={billingPerson}
                    className="billinginputfield"
                    onChange={(e) =>
                        handleFieldChange("billingPerson", e.target.value, () =>
                            setBillingPerson(e.target.value)
                        )
                    }
                />
                {errors.billingPerson && <span className="error">{errors.billingPerson}</span>}
            </div>

            <div className="form-group">
                <label className="inputLabel">Mode of Payment</label>
                <Select
                    options={paymentOptions}
                    value={paymentOptions.find((opt) => opt.value === modeOfPayment) || null}
                    onChange={(selected) =>
                        handleFieldChange("modeOfPayment", selected?.value || "", () =>
                            setModeOfPayment(selected?.value || "")
                        )
                    }
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select payment method..."
                />
                {errors.modeOfPayment && <span className="error">{errors.modeOfPayment}</span>}
            </div>
            <fieldset className="inputGroupWrapper">
                <legend className="groupLegend">Products</legend>
                {products.map((p, index) => (
                    <ProductRow
                        key={index}
                        product={p}
                        index={index}
                        productsLength={products.length}
                        productOptions={productOptions}
                        updateProduct={updateProduct}
                        addProduct={addProduct}
                        removeProduct={removeProduct}
                        isProductFill={isProductFill}
                        errors={errors}
                    />
                ))}
            </fieldset>
            {showPopup && <Popup message={popupMsg} onClose={() => setShowPopup(false)} />}

            <div className="form-actions">
                <button type="submit">Submit Bill</button>
            </div>
        </form>
    );
};