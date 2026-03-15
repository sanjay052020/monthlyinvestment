import bcrypt
import secrets   # <-- you forgot to import this
from models.user_model import (
    find_user_by_email,
    create_user,
    save_reset_token,
    find_by_reset_token,
    update_user_password,
    clear_reset_token
)
from utils.jwt_utils import generate_token

def register_user(email, password, role="user"):
    if find_user_by_email(email):
        return {"error": "User already exists"}
    
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    user_data = {"email": email, "password": hashed_pw, "role": role}
    create_user(user_data)
    return {"message": "User registered successfully"}

def login_user(email, password):
    user = find_user_by_email(email)
    if not user:
        return {"error": "User not found"}
    
    if bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        token = generate_token({"email": email, "role": user["role"]})
        return {"token": token}
    else:
        return {"error": "Invalid credentials"}

def forgot_password(email):
    user = find_user_by_email(email)
    if not user:
        return {"error": "User not found"}
    
    # generate secure random token
    token = secrets.token_urlsafe(32)
    save_reset_token(email, token)
    
    # In production: send token via email
    return {"message": "Password reset token generated", "reset_token": token}

def reset_password(token, new_password):
    user = find_by_reset_token(token)
    if not user:
        return {"error": "Invalid or expired token"}
    
    hashed_pw = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())
    update_user_password(user["email"], hashed_pw)
    clear_reset_token(user["email"])
    return {"message": "Password reset successful"}