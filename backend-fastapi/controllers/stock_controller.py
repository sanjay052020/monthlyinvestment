import random
from config import stocks
from models.stock_model import StockCreate

def generate_stock_id() -> str:
    """Generate a dynamic 10-digit Stock ID"""
    return str(random.randint(10**9, 10**10 - 1))

def add_stock(data: StockCreate):
    stock_id = generate_stock_id()
    record = {
        "stock_id": stock_id,
        "name": data.name,
        "quantity": data.quantity,
        "price": data.price,
        "category": data.category,
        "vendor_name": data.vendor_name,
        "date": str(data.date)
    }
    stocks.insert_one(record)
    return {"message": "Stock added successfully", "stock_id": stock_id}

def add_multiple_stocks(data_list: list[StockCreate]):
    results = []
    for data in data_list:
        stock_id = generate_stock_id()
        record = {
            "stock_id": stock_id,
            "name": data.name,
            "quantity": data.quantity,
            "price": data.price,
            "category": data.category,
            "vendor_name": data.vendor_name,
            "date": str(data.date)
        }
        stocks.insert_one(record)
        results.append({"stock_id": stock_id, "name": data.name})
    return {"message": "Stocks added successfully", "stocks": results}

def list_stocks():
    return list(stocks.find({}, {"_id": 0}))

def fetch_stock_by_id(stock_id: str):
    return stocks.find_one({"stock_id": stock_id}, {"_id": 0})

def update_stock(stock_id: str, updates: dict):
    result = stocks.update_one({"stock_id": stock_id}, {"$set": updates})
    if result.matched_count == 0:
        return {"error": "Stock not found"}
    return {"message": "Stock updated successfully"}

def remove_stock(stock_id: str):
    result = stocks.delete_one({"stock_id": stock_id})
    if result.deleted_count == 0:
        return {"error": "Stock not found"}
    return {"message": "Stock deleted successfully"}