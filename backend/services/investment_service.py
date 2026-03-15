from models.investment_model import (
    create_investment,
    get_all_investments,
    get_investments_by_month,
    get_investment_by_id,
    update_investment,
    delete_investment,
    create_investments
)

def add_investment(data):
    # If data is a list → bulk insert
    if isinstance(data, list):
        create_investments(data)
        return {"message": f"{len(data)} investments added successfully"}
    else:
        create_investment(data)
        return {"message": "Investment added successfully"}


def list_investments():
    return get_all_investments()

def list_investments_by_month(month, year):
    return get_investments_by_month(month, year)

def fetch_investment_by_id(investment_id):
    inv = get_investment_by_id(investment_id)
    if inv:
        return inv
    return {"error": "Investment not found"}

def edit_investment(investment_id, updates):
    result = update_investment(investment_id, updates)
    if result.modified_count > 0:
        return {"message": "Investment updated successfully"}
    return {"error": "No investment found or no changes applied"}

def remove_investment(investment_id):
    result = delete_investment(investment_id)
    if result.deleted_count > 0:
        return {"message": "Investment deleted successfully"}
    return {"error": "No investment found"}