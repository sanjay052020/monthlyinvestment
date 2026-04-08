from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Payment(BaseModel):
    amount: float = Field(..., gt=0)              # how much was paid
    date: datetime = Field(default_factory=datetime.utcnow)
    source: str                                   # e.g., "bank transfer", "cash", "UPI"

class Loan(BaseModel):
    borrower_id: str
    amount: float = Field(..., gt=0)              # principal
    interest_rate: float = Field(..., ge=0)       # monthly interest %
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime                            # required
    status: str = "active"                        # active, repaid, defaulted
    payments: List[Payment] = []                  # list of payment records
    total_amount: Optional[float] = None          # principal + interest
    months: Optional[int] = None
    borrower_name: str
    mobile: str

class LoanUpdate(BaseModel):
    amount: Optional[float]
    interest_rate: Optional[float]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    status: Optional[str]
    borrower_name: Optional[str]
    mobile: Optional[str]
    payments: Optional[List[Payment]]             # allow updating payments