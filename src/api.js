// src/api.js

// Fetch data from TheMealDB API
// Fetch a random meal
export async function getRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        return data.meals[0];
    }
    catch (error) {
        console.error("Error fetching random meal:", error);
        return null;
    }
}

// Fetch multiple random meals for random suggestions when page loads
export async function getRandomMeals(count = 5) {
    const promise = Array.from({ length: count }, () => getRandomMeal());
    const results = await Promise.all(promise);
    return results.filter(meal => meal !== null);
    }

    // Fetch meal by ingredient in search bar
    export async function getMealsByIngredient(ingredient) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=$ingredient`);
            const data = await response.json();
            return data.meals;
        }
        catch (error) {
            console.error("Error fetching meals by ingredient:", error);
            return null;
        }
    }