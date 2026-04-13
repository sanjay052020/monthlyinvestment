import os, time
import shutil
from fastapi import UploadFile, File, Form
from fastapi.responses import FileResponse
from bson import ObjectId
from models.upload_model import UploadResponse
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.file_uploads
files_collection = db.files

DOWNLOAD_DIR = "D:/repository/monthlyinvestment/Downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

UPLOAD_DIR = "D:/repository/monthlyinvestment/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_app_id():
    """Generate numeric app ID using timestamp in ms."""
    return str(int(time.time() * 1000))

# Upload new file
async def upload_file(file: UploadFile = File(...), name: str = Form(...), comments: str = Form(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    app_id = generate_app_id()   # generate custom app ID

    file_doc = {
        "id": app_id,             # <-- store custom app ID in MongoDB
        "filename": file.filename,
        "name": name,
        "comments": comments,
        "path": file_path,
        "content_type": file.content_type,
    }
    result = await files_collection.insert_one(file_doc)

    return UploadResponse(
        id=app_id,
        file_id=str(result.inserted_id),
        filename=file.filename,
        name=name,
        comments=comments,
        path=file_path
    )

# Update existing file
async def update_file(file_id: str, file: UploadFile = File(...), name: str = Form(...), comments: str = Form(...)):
    file_doc = await files_collection.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        return None

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    app_id = generate_app_id()

    await files_collection.update_one(
        {"_id": ObjectId(file_id)},
        {"$set": {
            "id": app_id,   # <-- update custom app ID too
            "filename": file.filename,
            "name": name,
            "comments": comments,
            "path": file_path,
            "content_type": file.content_type
        }}
    )

    return UploadResponse(
        id=app_id,
        file_id=file_id,
        filename=file.filename,
        name=name,
        comments=comments,
        path=file_path
    )

# Download file
async def download_file(file_id: str):
    file_doc = await files_collection.find_one({"_id": ObjectId(file_id)})
    if not file_doc:
        return None

    file_path = file_doc["path"]
    if not os.path.exists(file_path):
        return None

    # Copy file into local downloads folder
    local_download_path = os.path.join(DOWNLOAD_DIR, file_doc["filename"])
    shutil.copy(file_path, local_download_path)

    # Return file as response (so client can download too)
    return FileResponse(
        path=local_download_path,
        filename=file_doc["filename"],
        media_type=file_doc["content_type"]
    )


async def delete_file_by_file_id(file_id: str):
    try:
        obj_id = ObjectId(file_id)   # ensure proper ObjectId conversion
    except Exception:
        return None

    file_doc = await files_collection.find_one({"_id": obj_id})
    if not file_doc:
        return None

    # Remove file from disk if exists
    file_path = file_doc.get("path")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    # Remove metadata from MongoDB
    await files_collection.delete_one({"_id": obj_id})
    return {"message": f"File with file_id {file_id} deleted successfully"}

async def delete_file_by_app_id(app_id: str):
    file_doc = await files_collection.find_one({"id": app_id})
    if not file_doc:
        return None

    file_path = file_doc.get("path")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    await files_collection.delete_one({"id": app_id})
    return {"message": f"File with app id {app_id} deleted successfully"}


async def list_files():
    cursor = files_collection.find({})
    files = []
    async for doc in cursor:
        files.append(
            UploadResponse(
                id=doc.get("id", ""),          # now populated from DB
                file_id=str(doc["_id"]),
                filename=doc["filename"],
                name=doc["name"],
                comments=doc["comments"],
                path=doc["path"]
            )
        )
    return files



