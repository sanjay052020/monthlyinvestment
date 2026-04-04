from pymongo import MongoClient
from config import MONGO_URI
from bson.objectid import ObjectId
from bson.errors import InvalidId
import random
from pymongo.errors import DuplicateKeyError


client = MongoClient(MONGO_URI)
db = client["monthly-investment"]

# Collections
users = db["users"]              # auth users
dbusers = db["user_management"]  # contact users

# ---------------- AUTH USER FUNCTIONS ----------------
def find_user_by_email(email):
    return users.find_one({"email": email})

def create_user(user_data):
    mobile_no = user_data.get("mobile_no")

    # Application-level check
    existing_user = users.find_one({"mobile_no": mobile_no})
    if existing_user:
        raise ValueError("Mobile number already exists")

    try:
        result = users.insert_one(user_data)
        return str(result.inserted_id)
    except DuplicateKeyError:
        # Database-level enforcement
        raise ValueError("Mobile number already exists")



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

# ---------------- CONTACT USER FUNCTIONS ----------------
def list_users():
    """Return all contact users (exclude Mongo _id)."""
    return list(dbusers.find({}, {"_id": 0}))

def fetch_users():
    """Return all contact users including _id as string."""
    results = []
    for u in dbusers.find({}):
        u["_id"] = str(u["_id"])
        results.append(u)
    return results

def fetch_user(user_id: str):
    """Return single contact user by ObjectId."""
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        return None
    user = dbusers.find_one({"_id": oid})
    if user:
        user["_id"] = str(user["_id"])
    return user

def generate_user_id():
    """Generate unique 10-digit numeric ID."""
    while True:
        user_id = str(random.randint(10**9, 10**10 - 1))  # ensures 10 digits
        if not dbusers.find_one({"user_id": user_id}):
            return user_id

def add_user(user_data: dict):
    # Add a 10-digit numeric ID
    user_data["user_id"] = generate_user_id()
    result = dbusers.insert_one(user_data)
    # Only return the custom user_id, not Mongo _id
    return user_data["user_id"]



def edit_user(user_id: str, user_data: dict):
    """Update contact user by ID."""
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        return False
    result = dbusers.update_one({"_id": oid}, {"$set": user_data})
    return result.modified_count > 0

def remove_user(user_id: str):
    """Delete contact user by ID."""
    try:
        oid = ObjectId(user_id)
    except InvalidId:
        return False
    result = dbusers.delete_one({"_id": oid})
    return result.deleted_count > 0