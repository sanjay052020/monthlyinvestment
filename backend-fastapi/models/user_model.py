from pydantic import BaseModel, Field
from typing import Annotated

class Address(BaseModel):
    city: str
    state: str
    pin: Annotated[str, Field(pattern=r"^\d{6}$")]   # 6-digit PIN

class UserRegister(BaseModel):
    name: str
    mobile: Annotated[str, Field(pattern=r"^\d{10}$")]   # enforce 10 digits
    address: Address

class UserOut(BaseModel):
    userid: str
    name: str
    mobile: str
    address: Address