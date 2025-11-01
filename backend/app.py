import os
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Determine project root and model/data paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATHS = [
    os.path.join(BASE_DIR, "RidgeModel.pkl"),
    os.path.join(BASE_DIR, "ridge_model.pkl"),
    os.path.join(BASE_DIR, "model", "RidgeModel.pkl"),
]

model = None
for p in MODEL_PATHS:
    if os.path.exists(p):
        with open(p, "rb") as f:
            model = pickle.load(f)
        break

if model is None:
    # Try local path (same folder)
    local_p = os.path.join(os.path.dirname(__file__), "RidgeModel.pkl")
    if os.path.exists(local_p):
        with open(local_p, "rb") as f:
            model = pickle.load(f)


def load_cleaned_locations():
    data_path = os.path.join(BASE_DIR, "Cleaned_data.csv")
    if os.path.exists(data_path):
        try:
            df = pd.read_csv(data_path)
            if "location" in df.columns:
                return sorted(df["location"].dropna().unique().tolist())
        except Exception:
            pass
    return []


@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "message": "Bengaluru House Price API"})


@app.route("/locations", methods=["GET"])
def locations():
    locs = load_cleaned_locations()
    return jsonify({"locations": locs})


@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not found on server."}), 500

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Expecting keys: location, total_sqft, bath, bhk
    try:
        location = data.get("location")
        total_sqft = float(data.get("total_sqft"))
        bath = float(data.get("bath"))
        bhk = int(data.get("bhk"))
        
        # Input validation based on training data patterns
        if total_sqft < 300 or total_sqft > 10000:
            return jsonify({"error": "Total square feet should be between 300 and 10,000"}), 400
        if bath < 1 or bath > 8:
            return jsonify({"error": "Number of bathrooms should be between 1 and 8"}), 400
        if bhk < 1 or bhk > 6:
            return jsonify({"error": "BHK should be between 1 and 6"}), 400
        if total_sqft < bhk * 300:  # Minimum 300 sqft per bedroom
            return jsonify({"error": f"Total square feet seems too low for {bhk} BHK. Minimum suggested: {bhk * 300} sqft"}), 400
            
    except Exception as e:
        return jsonify({"error": f"Invalid input format: {e}"}), 400

    input_df = pd.DataFrame([[location, total_sqft, bath, bhk]], columns=["location", "total_sqft", "bath", "bhk"])

    try:
        pred = model.predict(input_df)[0]
        # The notebook stored price in lakhs. Convert to rupees for easier display.
        predicted_lakh = float(pred)
        
        # Handle negative predictions
        if predicted_lakh <= 0:
            return jsonify({
                "error": "Invalid prediction: The model predicted a negative price. Try adjusting your inputs - the combination might be unusual for the area."
            }), 400
            
        predicted_inr = float(predicted_lakh * 100000)
        
        # Add input validation message if price seems unusually low/high
        warning = None
        if predicted_lakh < 20:  # Less than 20 lakhs
            warning = "Note: The predicted price seems unusually low. Please verify your inputs."
        elif predicted_lakh > 1000:  # More than 1000 lakhs
            warning = "Note: The predicted price seems unusually high. Please verify your inputs."
            
        # Return both values; frontend will format the rupee value for display.
        return jsonify({
            "predicted_price_lakh": round(predicted_lakh, 3),
            "predicted_price_inr": predicted_inr,
            "units": "lakh",
            "warning": warning
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500


if __name__ == "__main__":
    # Run on port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
