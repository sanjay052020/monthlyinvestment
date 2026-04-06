from fastapi import APIRouter, HTTPException
from models.bill_model import BillCreate, BillOut
from controllers.bill_controller import generate_bill, list_bills, fetch_bill_by_id, update_bill, remove_bill

router = APIRouter(prefix="/bills", tags=["Bills"])

@router.post("/", response_model=BillOut)
def create_bill(data: BillCreate):
    try:
        result = generate_bill(data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[BillOut])
def get_all_bills():
    return list_bills()

@router.get("/{bill_id}", response_model=BillOut)
def get_bill(bill_id: str):
    result = fetch_bill_by_id(bill_id)
    if not result:
        raise HTTPException(status_code=404, detail="Bill not found")
    return result

@router.put("/{bill_id}")
def edit_bill(bill_id: str, updates: dict):
    result = update_bill(bill_id, updates)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/{bill_id}")
def delete_bill(bill_id: str):
    result = remove_bill(bill_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

