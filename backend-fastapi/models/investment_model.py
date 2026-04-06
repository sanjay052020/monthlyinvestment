from pydantic import BaseModel, Field
from datetime import date

class InvestmentCreate(BaseModel):
    date: date
    amount: float = Field(gt=0, description="Investment amount must be positive")
    toinvestment: str
    reason: str
    status: str = Field(default="pending", description="Status of the investment")

class InvestmentOut(BaseModel):
    investment_id: str
    date: date
    amount: float
    toinvestment: str
    reason: str
    status: str
