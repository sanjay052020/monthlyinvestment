from pymongo import MongoClient
from bson.objectid import ObjectId
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["monthly-investment"]
investments = db["investments"]

def create_investment(investment_data):
    return investments.insert_one(investment_data)

def create_investments(investment_list):
    return investments.insert_many(investment_list)


def get_all_investments():
    results = []
    for inv in investments.find({}):
        inv["_id"] = str(inv["_id"])   # convert ObjectId → string
        results.append(inv)
    return results

def get_investments_by_month(month, year):
    results = []
    for inv in investments.find({"date": {"$regex": f"^{year}-{month:02}"}}):
        inv["_id"] = str(inv["_id"])
        results.append(inv)
    return results

def get_investment_by_id(investment_id):
    inv = investments.find_one({"_id": ObjectId(investment_id)})
    if inv:
        inv["_id"] = str(inv["_id"])
    return inv

def update_investment(investment_id, updates):
    return investments.update_one({"_id": ObjectId(investment_id)}, {"$set": updates})

def delete_investment(investment_id):
    return investments.delete_one({"_id": ObjectId(investment_id)})