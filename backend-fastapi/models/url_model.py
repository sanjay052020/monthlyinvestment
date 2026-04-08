# models/url_model.py
from pydantic import BaseModel, HttpUrl
from typing import Optional

class UrlBase(BaseModel):
    url: HttpUrl
    comments: Optional[str] = None

class UrlCreate(UrlBase):
    pass

class UrlUpdate(BaseModel):
    url: Optional[HttpUrl] = None
    comments: Optional[str] = None

class UrlResponse(UrlBase):
    id: str