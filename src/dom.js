// src/dom.js
// This is where we manipulate the DOM to display recipes and the notebook

// Display recipes (search results or random suggestions) in the DOM
export function displayRecipes(recipes, container, onSave) {
    container.innerHTML = ''; // Clear previous content

    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image"/>
            <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank" class="recipe-link">View Recipe</a>
            <button class="save-recipe-button">Save to Notebook</button>
        `;

        // Save button functionality
        recipeCard.querySelector('.save-recipe-button').addEventListener('click', () => {
            onSave(recipe, (err, savedRecipe) => {
                if (err) {
                    alert(err.message); // From the callback in app.js
                } else {
                    alert(`${savedRecipe.strMeal} saved successfully! But when will you cook it?`);
                }
            });
        });

        container.appendChild(recipeCard);
    });
}

// Display Notebook (favorites)
export function displayNotebook(notebook, container, onDelete) {
    container.innerHTML = ''; // Clear previous content

    if (!notebook || notebook.length === 0) {
        container.innerHTML = '<p>Your Notebook is empty.</p>';
        return;
    }

    notebook.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image"/>
            <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank" class="recipe-link">View Recipe</a>
            <button class="delete-recipe-button">Delete</button>
        `;

        // Delete button functionality
        recipeCard.querySelector('.delete-recipe-button').addEventListener('click', () => {
            onDelete(recipe.idMeal);
        });

        container.appendChild(recipeCard);
    });
}