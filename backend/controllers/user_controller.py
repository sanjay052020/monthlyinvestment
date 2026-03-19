from models.user_model import list_users, get_user, add_user, update_user, delete_user

def fetch_users():
    return list_users()

def fetch_user(user_id: str):
    return get_user(user_id)

def create_user(user_data: dict):
    return add_user(user_data)

def edit_user(user_id: str, user_data: dict):
    return update_user(user_id, user_data)

def remove_user(user_id: str):
    return delete_user(user_id)