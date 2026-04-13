import uuid
from config import bills, stocks
from models.bill_model import BillCreate

def generate_bill(data: BillCreate):
    bill_id = str(uuid.uuid4())
    total_amount = 0
    items_out = []

    for item in data.items:
        stock = stocks.find_one({"stock_id": item.stock_id})
        if not stock:
            raise ValueError(f"Stock {item.stock_id} not found")
        if stock["quantity"] < item.quantity:
            raise ValueError(f"Insufficient stock for {stock['name']}")

        # Update stock quantity
        stocks.update_one({"stock_id": item.stock_id}, {"$inc": {"quantity": -item.quantity}})

        # Calculate line amount using provided price
        line_amount = item.price * item.quantity
        total_amount += line_amount

        items_out.append({"stock_id": item.stock_id, "quantity": item.quantity, "price": item.price})

    record = {
        "bill_id": bill_id,
        "customer_name": data.customer_name,
        "customer_mobile": data.customer_mobile,
        "date": str(data.date),
        "items": items_out,
        "total_amount": total_amount
    }
    bills.insert_one(record)
    return record

def list_bills():
    return list(bills.find({}, {"_id": 0}))

def fetch_bill_by_id(bill_id: str):
    return bills.find_one({"bill_id": bill_id}, {"_id": 0})

def update_bill(bill_id: str, updates: dict):
    existing_bill = bills.find_one({"bill_id": bill_id})
    if not existing_bill:
        return {"error": "Bill not found"}

    # If items are updated, adjust stock accordingly
    if "items" in updates:
        # First, restore stock from old bill items
        for old_item in existing_bill["items"]:
            stocks.update_one({"stock_id": old_item["stock_id"]}, {"$inc": {"quantity": old_item["quantity"]}})

        # Then, apply new items and reduce stock
        total_amount = 0
        new_items = []
        for item in updates["items"]:
            stock = stocks.find_one({"stock_id": item["stock_id"]})
            if not stock:
                return {"error": f"Stock {item['stock_id']} not found"}
            if stock["quantity"] < item["quantity"]:
                return {"error": f"Insufficient stock for {stock['stock_id']}"}

            stocks.update_one({"stock_id": item["stock_id"]}, {"$inc": {"quantity": -item["quantity"]}})
            line_amount = item["price"] * item["quantity"]
            total_amount += line_amount
            new_items.append(item)

        updates["items"] = new_items
        updates["total_amount"] = total_amount

    result = bills.update_one({"bill_id": bill_id}, {"$set": updates})
    return {"message": "Bill updated successfully"}

def remove_bill(bill_id: str):
    existing_bill = bills.find_one({"bill_id": bill_id})
    if not existing_bill:
        return {"error": "Bill not found"}

    # Rollback stock quantities from the bill items
    for item in existing_bill["items"]:
        stocks.update_one(
            {"stock_id": item["stock_id"]},
            {"$inc": {"quantity": item["quantity"]}}
        )

    # Delete the bill
    result = bills.delete_one({"bill_id": bill_id})
    if result.deleted_count == 0:
        return {"error": "Bill not found"}
    return {"message": "Bill deleted successfully and stock rolled back"}