from fastapi import APIRouter, HTTPException
from controllers.url_controller import UrlController
from models.url_model import UrlCreate, UrlUpdate, UrlResponse
from config import url_collection   # import the MongoDB collection

router = APIRouter(prefix="/urls", tags=["URLs"])
controller = UrlController(url_collection)   # pass collection here

@router.post("/", response_model=UrlResponse)
async def create_url(data: UrlCreate):
    return await controller.create_url(data)

@router.get("/{url_id}", response_model=UrlResponse)
async def get_url(url_id: str):
    url = await controller.get_url(url_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return url

@router.get("/", response_model=list[UrlResponse])
async def list_urls():
    return await controller.list_urls()

@router.put("/{url_id}", response_model=UrlResponse)
async def update_url(url_id: str, data: UrlUpdate):
    updated = await controller.update_url(url_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="URL not found or no changes applied")
    return updated

@router.delete("/{url_id}")
async def delete_url(url_id: str):
    success = await controller.delete_url(url_id)
    if not success:
        raise HTTPException(status_code=404, detail="URL not found")
    return {"message": "URL deleted successfully"}