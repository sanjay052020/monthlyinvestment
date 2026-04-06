from models.auth_model import UserRegister
from utils.jwt_utils import create_token, decode_token
from passlib.context import CryptContext
from config import users
from fastapi import HTTPException, Request

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(user: UserRegister):
    if users.find_one({"email": user.email}):
        return {"error": "Email already exists"}
    if users.find_one({"username": user.username}):
        return {"error": "Username already exists"}

    hashed_pw = pwd_context.hash(user.password)
    users.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role
    })
    return {"message": "User registered successfully"}

def login_user(email: str, password: str):
    user = users.find_one({"email": email})
    if not user or not pwd_context.verify(password, user["password"]):
        return {"error": "Invalid credentials"}
    token = create_token({"email": email, "role": user["role"], "username": user["username"]})
    return {"token": token}

def get_user_details(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    decoded = decode_token(token.split(" ")[-1])
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = users.find_one({"email": decoded["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user["username"],
        "email": user["email"],
        "role": user["role"]
    }

