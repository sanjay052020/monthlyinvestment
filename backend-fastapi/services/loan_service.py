from fastapi import APIRouter, HTTPException
from models.loan import Loan, LoanUpdate
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

@router.delete("/{loan_id}")
async def delete_loan(loan_id: str):
    return await loan_controller.remove_loan(loan_id)