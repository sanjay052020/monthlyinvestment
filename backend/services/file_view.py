from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from controllers.file_controller import (
    upload_file, 
    update_file, 
    download_file, 
    delete_file_by_file_id, 
    delete_file_by_app_id, 
    list_files
    )

router = APIRouter(prefix="/files", tags=["Files"])

@router.post("/upload")
async def upload(name: str = Form(...), comments: str = Form(...), file: UploadFile = File(...)):
    response = await upload_file(file=file, name=name, comments=comments)
    return response

@router.put("/update/{file_id}")
async def update(file_id: str, name: str = Form(...), comments: str = Form(...), file: UploadFile = File(...)):
    response = await update_file(file_id=file_id, file=file, name=name, comments=comments)
    if not response:
        raise HTTPException(status_code=404, detail="File not found for update")
    return response

@router.get("/download/{file_id}")
async def download(file_id: str):
    response = await download_file(file_id)
    if not response:
        raise HTTPException(status_code=404, detail="File not found for download")
    return response

@router.delete("/delete/file/{file_id}")
async def delete_by_file_id(file_id: str):
    response = await delete_file_by_file_id(file_id)
    if not response:
        raise HTTPException(status_code=404, detail="File not found for deletion by file_id")
    return response

@router.delete("/delete/app/{app_id}")
async def delete_by_app_id(app_id: str):
    response = await delete_file_by_app_id(app_id)
    if not response:
        raise HTTPException(status_code=404, detail="File not found for deletion by app_id")
    return response

@router.get("/all")
async def get_all_files():
    response = await list_files()
    return response

