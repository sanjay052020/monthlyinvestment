# views/user_view.py
from flask import Blueprint, request, jsonify
from controllers import user_controller

user_bp = Blueprint("user", __name__)

@user_bp.route("/users", methods=["GET"])
def list_users():
    return jsonify({"users": user_controller.fetch_users()})

@user_bp.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = user_controller.fetch_user(user_id)
    if not user:
        return jsonify({"error": "User not found or invalid ID"}), 404
    # Convert ObjectId to string if needed
    user["_id"] = str(user["_id"])
    return jsonify({"user": user})


@user_bp.route("/users", methods=["POST"])
def add_user():
    user_data = request.json
    user_id = user_controller.create_user(user_data)
    return jsonify({"message": "User created", "id": user_id})

@user_bp.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    user_data = request.json
    success = user_controller.edit_user(user_id, user_data)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User updated"})

@user_bp.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    success = user_controller.remove_user(user_id)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"})