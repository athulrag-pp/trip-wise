import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_and_evaluate_models():
    # 1. Load Data
    dataset_path = "/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/ml/dataset/tripwise_expense_dataset.csv"
    if not os.path.exists(dataset_path):
        from dataset.generate_dataset import generate_tripwise_dataset
        generate_tripwise_dataset()

    df = pd.read_csv(dataset_path)
    print(f"📊 Loaded dataset with shape: {df.shape}")

    # 2. Define Features & Target
    X = df.drop(columns=["total_daily_expense"])
    y = df["total_daily_expense"]

    categorical_cols = ["city", "vehicle_type", "food_type", "food_budget_tier", "activity_type", "transport_type"]
    numerical_cols = ["distance_km", "mileage_kmpl", "fuel_price_per_l", "meals_per_day", "activity_count", "needs_accommodation", "hotel_cost_per_night", "people_count"]

    # 3. Train Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols)
        ]
    )

    # 5. Define Candidate Models
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }

    results = {}
    best_model_name = None
    best_r2 = -float("inf")
    best_pipeline = None

    print("\n------------------------------------------------------------")
    print(f"{'Model Name':<30} | {'MAE (₹)':<10} | {'RMSE (₹)':<10} | {'R² Score':<10}")
    print("------------------------------------------------------------")

    for name, model in models.items():
        pipeline = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)

        results[name] = {"MAE": mae, "RMSE": rmse, "R2": r2}
        print(f"{name:<30} | ₹{mae:<9.2f} | ₹{rmse:<9.2f} | {r2:<10.4f}")

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_pipeline = pipeline

    print("------------------------------------------------------------")
    print(f"\n🏆 Best Model Selected: {best_model_name} with R² Score = {best_r2:.4f}")

    # 6. Save Trained Model Artifact
    os.makedirs("/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/ml/models", exist_ok=True)
    os.makedirs("/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/backend/app/ml_models", exist_ok=True)

    ml_save_path = "/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/ml/models/tripwise_expense_model.joblib"
    backend_save_path = "/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/backend/app/ml_models/tripwise_expense_model.joblib"

    joblib.dump(best_pipeline, ml_save_path)
    joblib.dump(best_pipeline, backend_save_path)

    print(f"💾 Saved trained model pipeline to:\n - {ml_save_path}\n - {backend_save_path}")

if __name__ == "__main__":
    train_and_evaluate_models()
