from fastapi import APIRouter, HTTPException, Request
from models.auth_model import UserRegister, UserLogin, UserOut
from controllers.auth_controller import register_user, login_user, get_user_details
from utils.jwt_utils import decode_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserRegister):
    result = register_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.post("/login")
def login(user: UserLogin):
    result = login_user(user.email, user.password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result

@router.get("/protected")
def protected(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")
    decoded = decode_token(token.split(" ")[-1])
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    if decoded["role"] != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return {"message": f"Welcome Admin {decoded['username']}!"}

@router.get("/user-details", response_model=UserOut)
def user_details(request: Request):
    return get_user_details(request)



