from pydantic import BaseModel, Field
from typing import List
from datetime import date
from typing import Annotated

class BillItem(BaseModel):
    stock_id: str
    quantity: int = Field(gt=0, description="Quantity purchased must be positive")
    price: float = Field(gt=0, description="Price per unit at billing time")

class BillCreate(BaseModel):
    customer_name: str
    customer_mobile: Annotated[str, Field(pattern=r"^\d{10}$")]   # enforce 10 digits
    date: date
    items: List[BillItem]

class BillOut(BaseModel):
    bill_id: str
    customer_name: str
    customer_mobile: str
    date: date
    items: List[BillItem]
    total_amount: float