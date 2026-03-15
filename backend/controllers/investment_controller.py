from flask import Blueprint, request, jsonify
from services.investment_service import (
    add_investment,
    list_investments,
    list_investments_by_month,
    fetch_investment_by_id,
    edit_investment,
    remove_investment
)
from utils.rbac_utils import require_role


investment_bp = Blueprint("investment", __name__)

@investment_bp.route("/add", methods=["POST"])
@require_role("admin")
def add():
    data = request.json
    result = add_investment(data)
    return jsonify(result)

@investment_bp.route("/all", methods=["GET"])
@require_role("admin")
def all_investments():
    return jsonify(list_investments())

@investment_bp.route("/month", methods=["GET"])
@require_role("admin")
def investments_by_month():
    month = int(request.args.get("month"))
    year = int(request.args.get("year"))
    return jsonify(list_investments_by_month(month, year))

@investment_bp.route("/<investment_id>", methods=["GET"])
@require_role("admin")
def get_by_id(investment_id):
    result = fetch_investment_by_id(investment_id)
    return jsonify(result)


@investment_bp.route("/<investment_id>", methods=["PUT"])
@require_role("admin")
def update(investment_id):
    updates = request.json
    result = edit_investment(investment_id, updates)
    return jsonify(result)

@investment_bp.route("/<investment_id>", methods=["DELETE"])
@require_role("admin")
def delete(investment_id):
    result = remove_investment(investment_id)
    return jsonify(result)