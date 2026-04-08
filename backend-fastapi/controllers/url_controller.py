# controllers/url_controller.py
from bson import ObjectId
from models.url_model import UrlCreate, UrlUpdate, UrlResponse

def url_helper(url) -> UrlResponse:
    return UrlResponse(
        id=str(url["_id"]),
        url=url["url"],
        comments=url.get("comments")
    )

class UrlController:
    def __init__(self, collection):
        self.collection = collection

    async def create_url(self, data: UrlCreate) -> UrlResponse:
        new_url = data.dict()
        new_url["url"] = str(new_url["url"])  # convert HttpUrl to string
        result = await self.collection.insert_one(new_url)
        new_url["_id"] = result.inserted_id
        return url_helper(new_url)

    async def get_url(self, url_id: str) -> UrlResponse | None:
        url = await self.collection.find_one({"_id": ObjectId(url_id)})
        return url_helper(url) if url else None

    async def list_urls(self) -> list[UrlResponse]:
        urls = await self.collection.find().to_list(length=100)
        return [url_helper(u) for u in urls]

    async def update_url(self, url_id: str, data: UrlUpdate) -> UrlResponse | None:
        update_data = {}
        for k, v in data.dict(exclude_unset=True).items():
            if v is not None:
                update_data[k] = str(v) if k == "url" else v

        if not update_data:
            return None

        result = await self.collection.update_one(
            {"_id": ObjectId(url_id)},
            {"$set": update_data}
        )
        if result.modified_count == 1:
            updated = await self.collection.find_one({"_id": ObjectId(url_id)})
            return url_helper(updated)
        return None

    async def delete_url(self, url_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(url_id)})
        return result.deleted_count == 1