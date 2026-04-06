MONGO_URI = "mongodb://localhost:27017/mvc_auth"
JWT_SECRET = "N3DF4-XHT6C-WKGQ2-PT4CJ-4VVYP"
JWT_ALGORITHM = "HS256"

from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["monthly-investment"]



