# bill_model.py
from datetime import datetime
import uuid
import random
from pymongo import MongoClient
import pytz


# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # adjust URI if needed
db = client["monthly-investment"]
bills_collection = db["bills"]

class Bill:
    def __init__(self, billing_person, mode_of_payment, date=None):
        self.id = str(uuid.uuid4())  # unique UUID
        self.billing_id = str(random.randint(10**9, 10**10 - 1))  # 10-digit random number
        self.billing_person = billing_person
        self.mode_of_payment = mode_of_payment

        # Always store IST datetime
        ist = pytz.timezone("Asia/Kolkata")
        self.date = date if date else datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

        self.products = []

    def add_product(self, product_name, productid=None, qty=0.0, rate=0.0, weight=None):
        product = {
            "name": product_name,
            "productId": productid,
            "qty": float(qty),
            "rate": float(rate),
            "weight": weight,
            "total": float(qty) * float(rate)
        }
        self.products.append(product)

    def remove_product(self, product_name):
        self.products = [p for p in self.products if p["name"] != product_name]

    def update_product(self, product_name, productid=None, qty=None, new_rate=None, weight=None):
        for p in self.products:
            if p["name"] == product_name:
                if productid: p["productId"] = productid
                if qty is not None: p["qty"] = float(qty)
                if new_rate is not None: p["rate"] = float(new_rate)
                if weight: p["weight"] = weight
                p["total"] = p["qty"] * p["rate"]

    def calculate_total(self):
        return sum(p["total"] for p in self.products)

    def update_bill(self, new_payment_mode=None, new_date=None):
        if new_payment_mode: self.mode_of_payment = new_payment_mode
        if new_date: self.date = new_date

    def to_dict(self):
        return {
            "id": self.id,
            "billing_id": self.billing_id,
            "billing_person": self.billing_person,
            "mode_of_payment": self.mode_of_payment,
            "date": self.date,
            "products": self.products,
            "total": self.calculate_total()
        }

    # MongoDB persistence methods
    def save_to_db(self):
        """Insert bill into MongoDB"""
        bills_collection.insert_one(self.to_dict())

    @staticmethod
    def get_bill_by_id(billing_id):
        """Retrieve bill by billing_id"""
        return bills_collection.find_one({"billing_id": str(billing_id)})

    @staticmethod
    def update_bill_in_db(billing_id, update_fields):
        """Update bill fields in MongoDB"""
        bills_collection.update_one(
            {"billing_id": str(billing_id)},
            {"$set": update_fields}
        )

    @staticmethod
    def delete_bill(billing_id):
        """Delete bill from MongoDB"""
        bills_collection.delete_one({"billing_id": str(billing_id)})