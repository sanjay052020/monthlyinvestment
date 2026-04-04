from flask import Blueprint, request, jsonify
from controllers import user_controller

user_bp = Blueprint("user", __name__)

# LIST ALL USERS
@user_bp.route("/users", methods=["GET"])
def list_users():
    users = user_controller.fetch_users()
    # Convert ObjectId to string for each user
    for u in users:
        if "_id" in u:
            u["_id"] = str(u["_id"])
    return jsonify({"users": users})


# GET SINGLE USER
@user_bp.route("/users/<user_id>", methods=["GET"])
def get_user(user_id):
    user = user_controller.fetch_user(user_id)
    if not user:
        return jsonify({"error": "User not found or invalid ID"}), 404
    user["_id"] = str(user["_id"])
    return jsonify({"user": user})


# CREATE USER
@user_bp.route("/users", methods=["POST"])
def add_user():
    user_data = request.json
    try:
        user_id = user_controller.create_user(user_data)
        return jsonify({
            "message": "User created successfully",
            "user_id": user_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# UPDATE USER
@user_bp.route("/users/<user_id>", methods=["PUT"])
def update_user(user_id):
    user_data = request.json
    success = user_controller.edit_user(user_id, user_data)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User updated"})

# DELETE USER
@user_bp.route("/users/<user_id>", methods=["DELETE"])
def delete_user(user_id):
    success = user_controller.remove_user(user_id)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"})