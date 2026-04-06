from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Loan(BaseModel):
    borrower_id: str
    amount: float = Field(..., gt=0)              # principal
    interest_rate: float = Field(..., ge=0)       # monthly interest %
    start_date: datetime = datetime.utcnow()
    end_date: datetime                            # required
    status: str = "active"                        # active, repaid, defaulted
    paid_amount: float = 0                        # how much has been repaid
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
    paid_amount: Optional[float]