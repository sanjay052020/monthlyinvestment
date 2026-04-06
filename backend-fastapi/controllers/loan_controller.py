from bson import ObjectId
from config import dbfinance
from models.loan import Loan, LoanUpdate
from datetime import datetime

collection = dbfinance["loans"]

def loan_helper(loan) -> dict:
    return {
        "id": str(loan["_id"]),
        "borrower_id": loan["borrower_id"],
        "borrower_name": loan.get("borrower_name"),   # new field
        "amount": loan["amount"],
        "interest_rate": loan["interest_rate"],
        "start_date": loan.get("start_date"),
        "end_date": loan.get("end_date"),
        "status": loan["status"],
        "paid_amount": loan.get("paid_amount", 0),
        "total_amount": loan.get("total_amount"),
        "months": loan.get("months"),
        "mobile": loan.get("mobile"),
    }

def calculate_months(start_date: datetime, end_date: datetime) -> int:
    """Calculate full months between two dates."""
    months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
    if end_date.day < start_date.day:
        months -= 1
    return max(months, 0)

def calculate_months(start_date: datetime, end_date: datetime) -> int:
    """Calculate full months between two dates."""
    months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
    if end_date.day < start_date.day:
        months -= 1
    return max(months, 0)

async def lend_money(loan: Loan):
    # calculate months between start and end
    months = calculate_months(loan.start_date, loan.end_date)

    # interest per month
    interest_per_month = loan.amount * (loan.interest_rate / 100)

    # total repayment = principal + monthly interest * months
    total_amount = loan.amount + (interest_per_month * months)

    loan_dict = loan.dict()

    # default paid_amount to 0 if not provided
    if loan_dict.get("paid_amount") is None:
        loan_dict["paid_amount"] = 0

    loan_dict["total_amount"] = total_amount
    loan_dict["months"] = months

    await collection.insert_one(loan_dict)
    return {
        "message": "Loan created successfully"
    }

async def list_loans():
    loans = await collection.find().to_list(length=100)
    return [loan_helper(loan) for loan in loans]

async def get_loan(loan_id: str):
    loan = await collection.find_one({"_id": ObjectId(loan_id)})
    return loan_helper(loan) if loan else None

async def modify_loan(loan_id: str, data: LoanUpdate):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    await collection.update_one({"_id": ObjectId(loan_id)}, {"$set": update_data})
    return await get_loan(loan_id)

async def repay_loan(loan_id: str):
    await collection.update_one({"_id": ObjectId(loan_id)}, {"$set": {"status": "repaid"}})
    return await get_loan(loan_id)

async def remove_loan(loan_id: str):
    await collection.delete_one({"_id": ObjectId(loan_id)})
    return {"message": "Loan deleted successfully"}