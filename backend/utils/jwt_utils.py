import jwt, os
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("N3DF4-XHT6C-WKGQ2-PT4CJ-4VVYP", "supersecret")
ALGORITHM = "HS256"

def create_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None