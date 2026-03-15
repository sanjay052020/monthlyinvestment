from functools import wraps
from flask import request, jsonify
from utils.jwt_utils import decode_token

def require_role(role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                return jsonify({"error": "Token missing"}), 401

            # ✅ Accept "Bearer <token>" and strip the prefix
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1]
            else:
                token = auth_header  # fallback if frontend sends raw token

            decoded = decode_token(token)
            if not decoded:
                return jsonify({"error": "Invalid or expired token"}), 401

            if decoded.get("role") != role:
                return jsonify({"error": "Access denied"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator