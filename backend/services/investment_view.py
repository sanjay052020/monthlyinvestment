from fastapi import APIRouter, HTTPException, Query
from models.investment_model import InvestmentCreate, InvestmentOut
from controllers.investment_controller import (
    add_investment, list_investments, list_investments_by_month,
    fetch_investment_by_id, edit_investment, remove_investment
)

router = APIRouter(prefix="/investments", tags=["Investments"])

@router.post("/", response_model=InvestmentOut)
def create_investment(data: InvestmentCreate):
    result = add_investment(data)
    return {
        "investment_id": result["investment_id"],
        "date": data.date,
        "amount": data.amount,
        "toinvestment": data.toinvestment,
        "reason": data.reason,
        "status": data.status
    }

@router.get("/", response_model=list[InvestmentOut])
def get_all_investments():
    return list_investments()

@router.get("/month", response_model=list[InvestmentOut])
def get_investments_by_month(month: int = Query(..., ge=1, le=12), year: int = Query(...)):
    return list_investments_by_month(month, year)

@router.get("/{investment_id}", response_model=InvestmentOut)
def get_investment(investment_id: str):
    result = fetch_investment_by_id(investment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Investment not found")
    return result

@router.put("/{investment_id}")
def update_investment(investment_id: str, updates: dict):
    result = edit_investment(investment_id, updates)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/{investment_id}")
def delete_investment(investment_id: str):
    result = remove_investment(investment_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result