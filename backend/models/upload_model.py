from pydantic import BaseModel, Field

class UploadModel(BaseModel):
    name: str = Field(..., example="Sanjay Sah")
    comments: str = Field(..., example="Personal notes")

class UploadResponse(BaseModel):
    id: str = Field(..., example="1712741305123")  # custom numeric app ID
    file_id: str = Field(..., example="661234abcd5678ef90123456")  # MongoDB ObjectId
    filename: str
    name: str
    comments: str
    path: str