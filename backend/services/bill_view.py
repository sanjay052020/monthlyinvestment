# bill_view.py
from flask import Blueprint, request, jsonify
from controllers.bill_controller import BillController
from models.bill_model import bills_collection

bill_routes = Blueprint("bill_routes", __name__)
controller = BillController()

# Utility: remove unwanted fields
def clean_bill(bill):
    bill.pop("_id", None)   # remove MongoDB ObjectId
    bill.pop("id", None)    # remove UUID
    return bill

# --- Create Bill with multiple products ---
@bill_routes.route("/bills", methods=["POST"])
def create_bill():
    data = request.json
    bill = controller.create_bill(
        data["billing_person"],
        data["mode_of_payment"],
        data.get("date")
    )

    # Add products if provided
    for product in data.get("products", []):
        controller.add_product_to_bill(
            bill["billing_id"],   # use billing_id
            product["name"],
            product.get("productId"),
            product.get("qty", 0),
            product.get("rate", 0),
            product.get("weight")
        )

    result = controller.read_bill(bill["billing_id"])
    return jsonify(clean_bill(result))

# --- Read all Bills ---
@bill_routes.route("/bills", methods=["GET"])
def get_bills():
    bills = [clean_bill(b) for b in bills_collection.find()]
    return jsonify(bills)

# --- Update Bill by billing_id ---
@bill_routes.route("/bills/<string:billing_id>", methods=["PUT"])
def update_bill(billing_id):
    data = request.json
    bill = controller.update_bill(billing_id, data.get("mode_of_payment"), data.get("date"))
    if not bill:
        return jsonify({"error": "Bill not found"}), 404
    return jsonify(clean_bill(bill))

# --- Delete Bill by billing_id ---
@bill_routes.route("/bills/<string:billing_id>", methods=["DELETE"])
def delete_bill(billing_id):
    bill = controller.read_bill(billing_id)
    if not bill:
        return jsonify({"error": "Bill not found"}), 404
    controller.delete_bill(billing_id)
    return jsonify({"message": f"Bill {billing_id} deleted"})