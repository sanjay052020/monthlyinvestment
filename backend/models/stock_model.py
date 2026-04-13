from pydantic import BaseModel, Field
from typing import Annotated, List, Union
from datetime import date

class StockCreate(BaseModel):
    productname: str
    producttype: str
    weight: Annotated[float, Field(ge=0, description="Quantity must be non-negative")]
    price: Annotated[float, Field(gt=0, description="Price must be positive")]
    vendor_name: str
    date: date   # single date only

class StockOut(BaseModel):
    stock_id: str
    productname: str
    producttype: str
    weight: float
    price: float
    vendor_name: str
    date: date

class BulkStockCreate(BaseModel):
    stocks: List[StockCreate]

# Union type for single or bulk
StockRequest = Union[StockCreate, BulkStockCreate]