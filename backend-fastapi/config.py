import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MongoDB connection string from environment
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# Initialize MongoDB client
client = MongoClient(MONGO_URI)

# Select database
db = client["monthly_investment"]

# Collections
users = db["users"]
dbusers = db["user_management"]
investments = db["investments"]
stocks = db["stockmanagement"]
bills = db["customerbills"]