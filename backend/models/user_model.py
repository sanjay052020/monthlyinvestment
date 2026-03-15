from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["monthly-investment"]
users = db["users"]

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
