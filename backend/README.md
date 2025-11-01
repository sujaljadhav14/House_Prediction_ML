# Backend (Flask)

This folder contains a minimal Flask API to serve the trained model for predictions.

Files:
- `app.py` - Flask app with `/predict` and `/locations` endpoints.
- `requirements.txt` - Python dependencies.

Quick start (Windows cmd):

1. Create and activate a virtual environment (optional but recommended):

    python -m venv venv
    venv\Scripts\activate

2. Install dependencies:

    pip install -r requirements.txt

3. Run the app:

    python app.py

The API will be available at http://localhost:5000

Notes:
- Ensure `RidgeModel.pkl` and `Cleaned_data.csv` exist in the project root (one level up).
- `/locations` returns a list of locations to populate the frontend dropdown.
- `/predict` expects JSON: {"location": "X", "total_sqft": 1000, "bath": 2, "bhk": 2}
