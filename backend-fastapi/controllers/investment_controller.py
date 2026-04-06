import uuid
from config import investments
from models.investment_model import InvestmentCreate

def add_investment(data: InvestmentCreate):
    investment_id = str(uuid.uuid4())
    record = {
        "investment_id": investment_id,
        "date": str(data.date),
        "amount": data.amount,
        "toinvestment": data.toinvestment,
        "reason": data.reason,
        "status": data.status
    }
    investments.insert_one(record)
    return {"message": "Investment added successfully", "investment_id": investment_id}

def list_investments():
    return list(investments.find({}, {"_id": 0}))

def list_investments_by_month(month: int, year: int):
    return list(investments.find({
        "date": {"$regex": f"^{year}-{month:02d}"}
    }, {"_id": 0}))

def fetch_investment_by_id(investment_id: str):
    return investments.find_one({"investment_id": investment_id}, {"_id": 0})

def edit_investment(investment_id: str, updates: dict):
    result = investments.update_one({"investment_id": investment_id}, {"$set": updates})
    if result.matched_count == 0:
        return {"error": "Investment not found"}
    return {"message": "Investment updated successfully"}

def remove_investment(investment_id: str):
    result = investments.delete_one({"investment_id": investment_id})
    if result.deleted_count == 0:
        return {"error": "Investment not found"}
    return {"message": "Investment deleted successfully"}