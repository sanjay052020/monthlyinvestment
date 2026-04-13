from fastapi import APIRouter, HTTPException
from models.stock_model import StockCreate, StockOut, BulkStockCreate, StockRequest
from controllers.stock_controller import (
    add_stock, add_multiple_stocks, list_stocks,
    fetch_stock_by_id, update_stock, remove_stock
)

router = APIRouter(prefix="/stocks", tags=["Stocks"])

@router.post("/", response_model=dict)
def create_stock(data: StockRequest):
    if isinstance(data, StockCreate):
        result = add_stock(data)
        return {
            "stock_id": result["stock_id"],
            "productname": data.productname,
            "producttype": data.producttype,
            "weight": data.weight,
            "price": data.price,
            "vendor_name": data.vendor_name,
            "date": data.date
        }
    elif isinstance(data, BulkStockCreate):
        return add_multiple_stocks(data.stocks)


@router.get("/", response_model=list[StockOut])
def get_all_stocks():
    return list_stocks()

@router.get("/{stock_id}", response_model=StockOut)
def get_stock(stock_id: str):
    result = fetch_stock_by_id(stock_id)
    if not result:
        raise HTTPException(status_code=404, detail="Stock not found")
    return result

@router.put("/{stock_id}")
def edit_stock(stock_id: str, updates: dict):
    result = update_stock(stock_id, updates)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@router.delete("/{stock_id}")
def delete_stock(stock_id: str):
    result = remove_stock(stock_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result