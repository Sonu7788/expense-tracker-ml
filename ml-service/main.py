from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# This model defines the shape of JSON data we expect from Node backend
class FeatureInput(BaseModel):
    total_spend_M: float
    num_transactions_M: int
    spend_food_M: float
    spend_rent_M: float
    spend_travel_M: float
    spend_shopping_M: float
    month_number: int

@app.get("/")
def root():
    return {"status": "ML service running correctly"}

@app.post("/predict/next-month-spend")
def predict_next_month_spend(features: FeatureInput):
    """
    For now, this is dummy logic (no real ML):
    - Next month spend ≈ current month total * 1.05 + (num_transactions * 10)
    You will later replace this formula with real ML model.predict(...)
    """
    base = features.total_spend_M
    predicted = base * 1.05 + features.num_transactions_M * 10

    # Return as JSON
    return {"predicted_next_month_spend": predicted}
