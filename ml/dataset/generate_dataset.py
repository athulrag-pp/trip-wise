import numpy as np
import pandas as pd
import os

def generate_tripwise_dataset(num_samples=2000, random_state=42):
    np.random.seed(random_state)

    cities = ["Chennai", "Bengaluru", "Mumbai", "Delhi", "Jaipur", "Kochi", "Hyderabad", "Goa"]
    vehicle_types = ["bike", "scooter", "car", "ev"]
    food_types = ["veg", "non_veg", "fast_food", "local_cuisine", "cafe"]
    food_budget_tiers = ["budget", "mid_range", "fine_dining"]
    activity_types = ["sightseeing", "shopping", "entertainment", "beach", "museum", "adventure", "cafe_hopping"]
    transport_types = ["personal_vehicle", "rental_vehicle", "public_transport", "taxi"]

    data = []

    for _ in range(num_samples):
        city = np.random.choice(cities)
        distance_km = round(np.random.uniform(10, 200), 1)
        v_type = np.random.choice(vehicle_types)
        
        if v_type == "bike":
            mileage = round(np.random.uniform(30, 50), 1)
        elif v_type == "scooter":
            mileage = round(np.random.uniform(40, 55), 1)
        elif v_type == "car":
            mileage = round(np.random.uniform(12, 22), 1)
        else: # EV
            mileage = round(np.random.uniform(0.1, 0.2), 2)

        fuel_price = 102.0 if v_type != "ev" else 8.5
        food_pref = np.random.choice(food_types)
        food_tier = np.random.choice(food_budget_tiers, p=[0.4, 0.45, 0.15])
        meals_count = np.random.choice([2, 3, 4], p=[0.2, 0.7, 0.1])
        act_count = np.random.choice([1, 2, 3, 4, 5])
        act_type = np.random.choice(activity_types)
        needs_hotel = np.random.choice([0, 1], p=[0.6, 0.4])
        hotel_cost = round(np.random.uniform(800, 4500), 2) if needs_hotel == 1 else 0.0
        people_count = np.random.choice([1, 2, 3, 4], p=[0.5, 0.3, 0.1, 0.1])
        t_type = np.random.choice(transport_types)

        # Target Total Daily Expense Math (with noise)
        if v_type == "ev":
            fuel_cost = (distance_km * mileage) * fuel_price
        else:
            fuel_cost = (distance_km / mileage) * fuel_price

        food_meal_base = 150.0 if food_tier == "budget" else (320.0 if food_tier == "mid_range" else 700.0)
        food_cost = food_meal_base * meals_count * people_count
        activity_cost = act_count * 120.0 * people_count
        local_transit_cost = 50.0 if t_type == "personal_vehicle" else (250.0 if t_type == "rental_vehicle" else (80.0 if t_type == "public_transport" else 400.0))
        misc_cost = 100.0 * people_count

        # Target variable with realistic Gaussian noise (+-5%)
        true_total = food_cost + fuel_cost + activity_cost + local_transit_cost + misc_cost + hotel_cost
        noise = np.random.normal(0, true_total * 0.04)
        total_daily_expense = round(max(200.0, true_total + noise), 2)

        data.append({
            "city": city,
            "distance_km": distance_km,
            "vehicle_type": v_type,
            "mileage_kmpl": mileage,
            "fuel_price_per_l": fuel_price,
            "food_type": food_pref,
            "food_budget_tier": food_tier,
            "meals_per_day": meals_count,
            "activity_count": act_count,
            "activity_type": act_type,
            "needs_accommodation": needs_hotel,
            "hotel_cost_per_night": hotel_cost,
            "people_count": people_count,
            "transport_type": t_type,
            "total_daily_expense": total_daily_expense
        })

    df = pd.DataFrame(data)
    os.makedirs("/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/ml/dataset", exist_ok=True)
    csv_path = "/Users/athulragpp/.gemini/antigravity-ide/scratch/tripwise/ml/dataset/tripwise_expense_dataset.csv"
    df.to_csv(csv_path, index=False)
    print(f"✅ Generated {len(df)} realistic training samples at: {csv_path}")
    return df

if __name__ == "__main__":
    generate_tripwise_dataset()
