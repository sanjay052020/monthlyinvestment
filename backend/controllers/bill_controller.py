# bill_controller.py
from models.bill_model import Bill

class BillController:
    def __init__(self):
        pass  # no need for self.bills, we use MongoDB

    def create_bill(self, billing_person, mode_of_payment, date=None):
        bill = Bill(billing_person, mode_of_payment, date)
        bill.save_to_db()  # persist in MongoDB
        return bill.to_dict()

    def read_bill(self, billing_id):
        return Bill.get_bill_by_id(billing_id)

    def update_bill(self, billing_id, new_payment_mode=None, new_date=None):
        update_fields = {}
        if new_payment_mode:
            update_fields["mode_of_payment"] = new_payment_mode
        if new_date:
            update_fields["date"] = new_date
        if update_fields:
            Bill.update_bill_in_db(billing_id, update_fields)
        return Bill.get_bill_by_id(billing_id)

    def delete_bill(self, billing_id):
        Bill.delete_bill(billing_id)
        return {"status": "deleted", "billing_id": billing_id}

    def add_product_to_bill(self, billing_id, product_name, productid, qty, rate, weight=None):
        bill_data = Bill.get_bill_by_id(billing_id)
        if bill_data:
            bill = Bill(
                bill_data["billing_person"],
                bill_data["mode_of_payment"],
                bill_data["date"]
            )
            bill.billing_id = bill_data["billing_id"]
            bill.products = bill_data["products"]

            bill.add_product(product_name, productid, qty, rate, weight)
            Bill.update_bill_in_db(billing_id, {"products": bill.products, "total": bill.calculate_total()})
            return Bill.get_bill_by_id(billing_id)
        return None

    def remove_product_from_bill(self, billing_id, product_name):
        bill_data = Bill.get_bill_by_id(billing_id)
        if bill_data:
            bill = Bill(
                bill_data["billing_person"],
                bill_data["mode_of_payment"],
                bill_data["date"]
            )
            bill.id = bill_data["id"]
            bill.billing_id = bill_data["billing_id"]
            bill.products = bill_data["products"]

            bill.remove_product(product_name)
            Bill.update_bill_in_db(billing_id, {"products": bill.products, "total": bill.calculate_total()})
            return Bill.get_bill_by_id(billing_id)
        return None

    def update_product_in_bill(self, billing_id, product_name, productid=None, qty=None, new_rate=None, weight=None):
        bill_data = Bill.get_bill_by_id(billing_id)
        if bill_data:
            bill = Bill(
                bill_data["billing_person"],
                bill_data["mode_of_payment"],
                bill_data["date"]
            )
            bill.id = bill_data["id"]
            bill.billing_id = bill_data["billing_id"]
            bill.products = bill_data["products"]

            bill.update_product(product_name, productid, qty, new_rate, weight)
            Bill.update_bill_in_db(billing_id, {"products": bill.products, "total": bill.calculate_total()})
            return Bill.get_bill_by_id(billing_id)
        return None