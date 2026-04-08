import os
from pymongo import MongoClient
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables from .env file
load_dotenv()

# MongoDB connection string from environment
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "finance_db"

# Initialize MongoDB client
client = MongoClient(MONGO_URI)
db = client["monthly_investment"]

clientfinance = AsyncIOMotorClient(MONGO_URI)
dbfinance = clientfinance[DB_NAME]
urlDBName = clientfinance["URL_DB"]
# Collections
users = db["users"]
dbusers = db["user_management"]
investments = db["investments"]
stocks = db["stockmanagement"]
bills = db["customerbills"]
url_collection = urlDBName["urls"]

