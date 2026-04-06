from fastapi import APIRouter, HTTPException
from models.user_model import UserRegister, UserOut
from controllers.user_controller import create_user, get_user, list_users, update_user, delete_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
def register_user(user: UserRegister):
    result = create_user(user)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {
        "userid": result["userid"],
        "name": user.name,
        "mobile": user.mobile,
        "address": user.address
    }

@router.get("/{userid}", response_model=UserOut)
def fetch_user(userid: str):
    user = get_user(userid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=list[UserOut])
def fetch_all_users():
    return list_users()

@router.put("/{userid}")
def edit_user(userid: str, user: UserRegister):
    result = update_user(userid, user)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@router.delete("/{userid}")
def remove_user(userid: str):
    success = delete_user(userid)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}