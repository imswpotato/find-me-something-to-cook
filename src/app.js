// src/app.js
import { getRandomRecipes, getRecipesByIngredient } from './api.js';
import { displayRecipes, displayNotebook } from './dom.js';

const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const results = document.getElementById('results');
const notebookContainer = document.getElementById('notebook');

// Notebook storage in localStorage
let notebook = JSON.parse(localStorage.getItem('notebook')) || [];

// Save recipe to notebook
function saveToNotebook(recipe) {
    if (!notebook.find(fav => fav.idMeal === recipe.idMeal)) {
        notebook.push(recipe);
        localStorage.setItem('notebook', JSON.stringify(notebook));
        alert(`${recipe.strMeal} saved to notebook!`);
        displayNotebook(notebook, notebookContainer, deleteFromNotebook);
    } else {
        alert(`${recipe.strMeal} is already in your notebook.`);
    }
}

// Delete recipe from notebook
function deleteFromNotebook(idMeal) {
    const recipeToDelete = notebook.find(fav => fav.idMeal === idMeal);
    notebook = notebook.filter(fav => fav.idMeal !== idMeal);
    localStorage.setItem('notebook', JSON.stringify(notebook));
    if (recipeToDelete) {
        alert(`${recipeToDelete.strMeal} removed from notebook.`);
    }
    displayNotebook(notebook, notebookContainer, deleteFromNotebook);
}

// Show multiple random recipes on page load
window.addEventListener('load', async () => {
    try {
        const randomRecipes = await getRandomRecipes(3);
        console.log('Random Recipes on Load:', randomRecipes);
        displayRecipes(randomRecipes, results, saveToNotebook);
        displayNotebook(notebook, notebookContainer, deleteFromNotebook);
    } catch (error) {
        console.error('Error loading initial recipes:', error);
        results.innerHTML = '<p>Error loading recipes. Please try again later.</p>';
    }
});

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Search recipes by ingredient
searchBtn.addEventListener('click', async () => {
    const inputEl = document.getElementById('ingredientInput');
    if (!inputEl) {
        alert('Ingredient input not found.');
        return;
    }

    const ingredient = inputEl.value.trim();
    if (!ingredient) {
        alert('Please enter an ingredient to search.');
        return;
    }

    try {
        const recipes = await getRecipesByIngredient(ingredient);
        if (recipes && recipes.length > 0) {
            const limitedRecipes = recipes.slice(0, 3);

            // Show spinner and loading message immediately
            results.innerHTML = `
            <div class="spinner-container">
            <div class="spinner"></div>
            <h3>Finding something yummy... please wait</h3>
            </div>
            `;
            console.log("Recipes returned:", recipes);
            console.log("Limited recipes:", limitedRecipes);
            // Wait 2 seconds before showing results
            delay(2000).then(() => {
                try {
                    displayRecipes(limitedRecipes, results, saveToNotebook);

                    // Fade in effect
                    const cards = document.querySelectorAll('.recipe-card');
                    console.log("Cards found:", cards.length);
                    cards.forEach((card, index) => {
                        card.style.animationDelay = `${index * 0.2}s`;
                    });
                } catch (renderError) {
                    console.error("Error rendering recipes:", renderError);
                    results.innerHTML = '<p>Oops! The kitchen is burning. Try again later.</p>';
                }
            });
        } else {
            results.innerHTML = '<p>Oops! Not sure how to cook that...</p>';
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        results.innerHTML = '<p>Oops! The kitchen is burning. Try again later.</p>';
    }
});

// Clear search results
clearBtn.addEventListener('click', () => {
    results.innerHTML = '';
});

// Refresh random recipes
refreshBtn.addEventListener('click', () => {
    getRandomRecipes(3)
        .then(randomRecipes => {
            displayRecipes(randomRecipes, results, saveToNotebook);
        })
        .catch(error => {
            console.error("Error refreshing recipes:", error);
        });
});