import React from "react";
import Select from "react-select";
import { PlusCircle, Trash } from "phosphor-react";
import { Product } from "./BillingForm";

interface ProductRowProps {
    product: Product;
    index: number;
    productsLength: number;
    productOptions: { value: string; label: string; productId: string }[];
    updateProduct: <K extends keyof Product>(index: number, field: K, value: Product[K]) => void;
    addProduct: () => void;
    removeProduct: (index: number) => void;
    isProductFill: (product: Product) => boolean;
    errors: { [key: string]: string };   // errors passed from parent
}

const ProductRow: React.FC<ProductRowProps> = ({
    product,
    index,
    productsLength,
    productOptions,
    updateProduct,
    addProduct,
    removeProduct,
    isProductFill,
    errors,
}) => {
    return (
        <div className="product-row">
            {/* Product Name */}
            <div className="product-field">
                <label>Product Name</label>
                <Select
                    options={productOptions}
                    value={
                        product.name
                            ? { value: product.productId, label: product.name, productId: product.productId }
                            : null
                    }
                    onChange={(selected) => {
                        if (selected) {
                            updateProduct(index, "name", selected.label);
                            updateProduct(index, "productId", selected.productId);
                            if (errors[`product-id-${index}`]) {
                                errors[`product-id-${index}`] = "";
                            }
                        }
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select product..."
                />
                {errors[`product-name-${index}`] && (
                    <span className="error">{errors[`product-name-${index}`]}</span>
                )}
            </div>

            {/* Product ID */}
            <div className="product-field">
                <label>Product ID</label>
                <input
                    type="text"
                    value={product.productId}
                    readOnly
                    placeholder="Please select product name"
                />
                {errors[`product-id-${index}`] && (
                    <span className="error">{errors[`product-id-${index}`]}</span>
                )}
            </div>

            {/* Qty */}
            <div className="product-field">
                <label>Qty</label>
                <input
                    type="number"
                    value={product.qty}
                    onChange={(e) => updateProduct(index, "qty", parseFloat(e.target.value))}
                />
                {errors[`product-qty-${index}`] && (
                    <span className="error">{errors[`product-qty-${index}`]}</span>
                )}
            </div>

            {/* Rate */}
            <div className="product-field">
                <label>Rate</label>
                <input
                    type="number"
                    value={product.rate}
                    onChange={(e) => updateProduct(index, "rate", parseFloat(e.target.value))}
                />
                {errors[`product-rate-${index}`] && (
                    <span className="error">{errors[`product-rate-${index}`]}</span>
                )}
            </div>

            {/* Weight */}
            <div className="product-field">
                <label>Weight</label>
                <input
                    type="text"
                    value={product.weight}
                    onChange={(e) => updateProduct(index, "weight", e.target.value)}
                    placeholder="Enter weight"
                />
                {errors[`product-weight-${index}`] && (
                    <span className="error">{errors[`product-weight-${index}`]}</span>
                )}
            </div>

            {/* Trash icon */}
            {productsLength > 1 && (
                <button type="button" className="billformicon-btn delete" onClick={() => removeProduct(index)}>
                    <Trash size={30} />
                </button>
            )}

            {/* Plus icon */}
            {index === productsLength - 1 && (
                <button
                    type="button"
                    className="btn productrowadd"
                    onClick={addProduct}
                    disabled={!isProductFill(product)}
                >
                    <PlusCircle size={30} color="white" />
                </button>
            )}
        </div>
    );
};

export default ProductRow;