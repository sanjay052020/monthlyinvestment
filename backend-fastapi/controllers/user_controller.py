import random
from config import dbusers
from models.user_model import UserRegister

def generate_userid() -> str:
    """Generate a dynamic 10-digit UserId"""
    return str(random.randint(10**9, 10**10 - 1))

def create_user(user: UserRegister):
    if dbusers.find_one({"mobile": user.mobile}):
        return {"error": "Mobile number already exists"}

    userid = generate_userid()
    user_data = {
        "userid": userid,
        "name": user.name,
        "mobile": user.mobile,
        "address": user.address.dict()
    }
    dbusers.insert_one(user_data)
    return {"message": "User created successfully", "userid": userid}

def get_user(userid: str):
    user = dbusers.find_one({"userid": userid}, {"_id": 0})
    return user

def list_users():
    return list(dbusers.find({}, {"_id": 0}))

def update_user(userid: str, user: UserRegister):
    existing = dbusers.find_one({"userid": userid})
    if not existing:
        return None
    # Prevent duplicate mobile for other users
    if dbusers.find_one({"mobile": user.mobile, "userid": {"$ne": userid}}):
        return {"error": "Mobile number already exists"}
    dbusers.update_one({"userid": userid}, {"$set": {
        "name": user.name,
        "mobile": user.mobile,
        "address": user.address.dict()
    }})
    return {"message": "User updated successfully"}

def delete_user(userid: str):
    result = dbusers.delete_one({"userid": userid})
    return result.deleted_count > 0