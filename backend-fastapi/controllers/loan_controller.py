from bson import ObjectId
from config import dbfinance
from models.loan import Loan, LoanUpdate, Payment
from datetime import datetime

collection = dbfinance["loans"]

def loan_helper(loan) -> dict:
    payments = loan.get("payments", [])
    total_paid = sum(p["amount"] for p in payments)
    remaining_balance = loan["amount"] - total_paid

    return {
        "id": str(loan["_id"]),
        "borrower_id": loan["borrower_id"],
        "borrower_name": loan.get("borrower_name"),
        "amount": loan["amount"],
        "interest_rate": loan["interest_rate"],
        "start_date": loan.get("start_date"),
        "end_date": loan.get("end_date"),
        "status": loan["status"],
        "payments": payments,
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

async def lend_money(loan: Loan):
    months = calculate_months(loan.start_date, loan.end_date)
    interest_per_month = loan.amount * (loan.interest_rate / 100)
    total_amount = loan.amount + (interest_per_month * months)

    loan_dict = loan.dict()
    loan_dict["payments"] = loan_dict.get("payments", [])
    loan_dict["total_amount"] = total_amount
    loan_dict["months"] = months

    await collection.insert_one(loan_dict)
    return {"message": "Loan created successfully"}

async def list_loans():
    loans = await collection.find().to_list(length=100)
    return [loan_helper(loan) for loan in loans]

async def get_loan(loan_id: str):
    loan = await collection.find_one({"_id": ObjectId(loan_id)})
    return loan_helper(loan) if loan else None

async def modify_loan(loan_id: str, data: LoanUpdate):
    update_data = {k: v for k, v in data.dict(exclude={"payments"}).items() if v is not None}
    await collection.update_one({"_id": ObjectId(loan_id)}, {"$set": update_data})
    return await get_loan(loan_id)

async def add_payment(loan_id: str, payment: Payment):
    loan = await collection.find_one({"_id": ObjectId(loan_id)})
    if not loan:
        return None

    # Add unique id to payment
    payment_data = payment.dict()
    payment_data["id"] = str(ObjectId())   # ✅ unique id for each payment
    payment_data["created_at"] = datetime.utcnow()  # optional timestamp

    # Push new payment
    await collection.update_one(
        {"_id": ObjectId(loan_id)},
        {"$push": {"payments": payment_data}}
    )

    # Recalculate remaining balance
    payments = loan.get("payments", [])
    total_paid = sum(p["amount"] for p in payments) + payment.amount
    remaining_balance = loan["amount"] - total_paid

    await collection.update_one(
        {"_id": ObjectId(loan_id)},
        {"$set": {"remaining_balance": remaining_balance}}
    )

    return await get_loan(loan_id)

async def repay_loan(loan_id: str):
    await collection.update_one({"_id": ObjectId(loan_id)}, {"$set": {"status": "repaid"}})
    return await get_loan(loan_id)

async def remove_loan(loan_id: str):
    await collection.delete_one({"_id": ObjectId(loan_id)})
    return {"message": "Loan deleted successfully"}

async def update_payment(loan_id: str, payment_id: str, payment_update: Payment):
    loan = await collection.find_one({"_id": ObjectId(loan_id)})
    if not loan:
        return None

    # Find the payment by id
    payments = loan.get("payments", [])
    updated = False
    for p in payments:
        if p.get("id") == payment_id:
            # Update only provided fields
            p.update(payment_update.dict(exclude_unset=True))
            updated = True
            break

    if not updated:
        return None

    # Save back to DB
    await collection.update_one(
        {"_id": ObjectId(loan_id)},
        {"$set": {"payments": payments}}
    )

    return await get_loan(loan_id)


async def delete_payment(loan_id: str, payment_id: str):
    try:
        oid = ObjectId(loan_id)  # validate loan_id
    except Exception:
        return None

    loan = await collection.find_one({"_id": oid})
    if not loan:
        return None

    payments = loan.get("payments", [])
    new_payments = [p for p in payments if p.get("id") != payment_id]

    if len(new_payments) == len(payments):
        return None

    await collection.update_one(
        {"_id": oid},
        {"$set": {"payments": new_payments}}
    )

    return await get_loan(loan_id)




