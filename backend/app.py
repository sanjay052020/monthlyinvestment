from flask import Flask
from flask_cors import CORS
from controllers.auth_controller import auth_bp
from controllers.investment_controller import investment_bp
from services.user_view import user_bp
from services.bill_view import bill_routes

app = Flask(__name__)

# Allow CORS from React frontend (port 3000)
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(investment_bp, url_prefix="/investment")
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(bill_routes)


if __name__ == "__main__":
    app.run(debug=True)