from fastapi import APIRouter, HTTPException
from models.loan import Loan, LoanUpdate, Payment
import controllers.loan_controller as loan_controller

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("/")
async def create_loan(loan: Loan):
    return await loan_controller.lend_money(loan)

@router.get("/")
async def get_loans():
    return await loan_controller.list_loans()

@router.get("/{loan_id}")
async def get_loan(loan_id: str):
    loan = await loan_controller.get_loan(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan

@router.put("/{loan_id}")
async def update_loan(loan_id: str, data: LoanUpdate):
    updated = await loan_controller.modify_loan(loan_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"message": "Loan updated successfully", "loan": updated}

@router.put("/{loan_id}/repay")
async def repay_loan(loan_id: str):
    updated = await loan_controller.repay_loan(loan_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"message": "Loan repaid successfully", "loan": updated}

@router.post("/{loan_id}/payments")
async def add_payment(loan_id: str, payment: Payment):
    updated = await loan_controller.add_payment(loan_id, payment)
    if not updated:
        raise HTTPException(status_code=404, detail="Loan not found")
    return {"message": "Payment added successfully", "loan": updated}

# NEW: Update a payment
@router.put("/{loan_id}/payments/{payment_id}")
async def update_payment(loan_id: str, payment_id: str, payment_update: Payment):
    updated = await loan_controller.update_payment(loan_id, payment_id, payment_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Loan or Payment not found")
    return {"message": "Payment updated successfully", "loan": updated}

# NEW: Delete a payment
@router.delete("/{loan_id}/payments/{payment_id}")
async def delete_payment(loan_id: str, payment_id: str):
    updated = await loan_controller.delete_payment(loan_id, payment_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Loan or Payment not found")
    return {"message": "Payment deleted successfully", "loan": updated}

@router.delete("/{loan_id}")
async def delete_loan(loan_id: str):
    return await loan_controller.remove_loan(loan_id)