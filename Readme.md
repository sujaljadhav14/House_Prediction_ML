# 🏠 Bengaluru House Price Prediction

A Machine Learning project that predicts **house prices in Bengaluru** based on factors like location, square footage, number of bedrooms (BHK), and bathrooms.  
This project focuses on **data preprocessing, feature engineering, outlier removal, and regression modeling** for accurate price estimation.

---

## 🚀 Overview

The goal is to build a **machine learning model** that predicts Bengaluru house prices with high accuracy.  
Currently focused on ML and analysis — later to be expanded into a **full-stack web app**.

---

## 🧰 Tech Stack

- 🐍 Python  
- 🧮 NumPy  
- 🧾 Pandas  
- 📈 Matplotlib  
- 🤖 Scikit-learn  

---

## 🧹 Data Preprocessing

- Handled missing values in key columns.  
- Extracted BHK count from `size`.  
- Converted sqft ranges to numeric averages.  
- Added `price_per_feet` feature.  
- Simplified rare locations (≤10 entries → “other”).  
- Removed outliers based on sqft/BHK and price-per-sqft.

---

## 🤖 Model Performance

| Model | R² Score | Notes |
|--------|-----------|-------|
| Linear Regression | 0.8296 | Baseline model |
| Lasso Regression | 0.8199 | Feature selection (L1) |
| **Ridge Regression** | **0.8297** | Best stability (L2) |

✅ **Best Model:** Ridge Regression  
📊 Explains ~83% variance in house prices.

---

## 🔮 Future Enhancements

- 🌐 Frontend: React / Bootstrap web interface  
- ⚙️ Backend: Flask / FastAPI API  
- 💾 Deployment: Render / Streamlit / Hugging Face Spaces  
- 📈 Dashboard: Plotly / Streamlit visualizations  
- 🧩 More features: Amenities, distance, furnishing, etc.

---

## ✨ Author

**👤 Sujal Jadhav**  
🎓 B.E. Artificial Intelligence & Data Science @ Terna Engineering College  
💻 Passionate about ML, Python & Full Stack Development  
📧 [sujaljadhav14@gmail.com](mailto:sujaljadhav14@gmail.com)  
🌐 [GitHub: sujaljadhav14](https://github.com/sujaljadhav14)
