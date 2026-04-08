from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.auth_view import router as auth_router
from services.user_view import router as user_router
from services.investment_view import router as investment_view
from services.stock_view import router as stock_view
from services.bill_view import router as bill_view
from services.loan_service import router as loan_view
from services.url_view import router as url_view

app = FastAPI(title="Secure FastAPI Auth")

# Configure CORS
origins = [
    "http://localhost:3000",   # React dev server
    "http://127.0.0.1:3000",
    # Add production frontend domain here, e.g. "https://myapp.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # allowed origins
    allow_credentials=True,         # allow cookies/headers
    allow_methods=["*"],            # allow all HTTP methods
    allow_headers=["*"],            # allow all headers
)

# Register routes
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(investment_view)
app.include_router(stock_view)
app.include_router(bill_view)
app.include_router(loan_view)
app.include_router(url_view)
