from pymongo import MongoClient
from config import MONGO_URI
from bson.objectid import ObjectId
from bson.errors import InvalidId


client = MongoClient(MONGO_URI)
db = client["monthly-investment"]
users = db["users"]
dbusers = db["user_management"]

def find_user_by_email(email):
    return users.find_one({"email": email})

def create_user(user_data):
    return users.insert_one(user_data)

def update_user_role(email, role):
    return users.update_one({"email": email}, {"$set": {"role": role}})

def update_user_password(email, hashed_pw):
    return users.update_one({"email": email}, {"$set": {"password": hashed_pw}})

def save_reset_token(email, token):
    return users.update_one({"email": email}, {"$set": {"reset_token": token}})

def find_by_reset_token(token):
    return users.find_one({"reset_token": token})

def clear_reset_token(email):
    return users.update_one({"email": email}, {"$unset": {"reset_token": ""}})

def list_users():
    return list(dbusers.find({}, {"_id": 0}))  # exclude Mongo _id

def get_user(user_id: str):
    try:
        oid = ObjectId(user_id)   # validate format
    except InvalidId:
        return None               # return None if invalid
    return dbusers.find_one({"_id": oid})


def add_user(user_data: dict):
    result = dbusers.insert_one(user_data)
    return str(result.inserted_id)

def update_user(user_id: str, user_data: dict):
    dbusers.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    return True

def delete_user(user_id: str):
    dbusers.delete_one({"_id": ObjectId(user_id)})
    return True
