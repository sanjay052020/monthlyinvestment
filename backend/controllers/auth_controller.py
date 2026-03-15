from flask import Blueprint, request, jsonify
from services.auth_service import forgot_password, register_user, login_user, reset_password
from utils.jwt_utils import decode_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    result = register_user(data["email"], data["password"], data.get("role", "user"))
    return jsonify(result)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    result = login_user(data["email"], data["password"])
    return jsonify(result)

@auth_bp.route("/protected", methods=["GET"])
def protected():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Token missing"}), 401
    
    decoded = decode_token(token)
    if not decoded:
        return jsonify({"error": "Invalid or expired token"}), 401
    
    # RBAC check
    if decoded["role"] != "admin":
        return jsonify({"error": "Access denied"}), 403
    
    return jsonify({"message": "Welcome Admin!"})

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot():
    data = request.json
    result = forgot_password(data["email"])
    return jsonify(result)

@auth_bp.route("/reset-password", methods=["POST"])
def reset():
    data = request.json
    result = reset_password(data["token"], data["newPassword"])
    return jsonify(result)
