// src/app.js
// This is where the main functionality of the app is implemented

// Import necessary functions
import { getRandomRecipes, getRecipesByIngredient } from './api.js';
import { displayRecipes, displayNotebook } from './dom.js';

// Get DOM elements
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const results = document.getElementById('results');
const notebookContainer = document.getElementById('notebook');

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

// Delay function using promise
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
    console.log("Searching for ingredient:", inputEl.value);

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
            <h3>Looking for something yummy... please wait</h3>
            </div>
            `;
            console.log("Recipes returned:", recipes);
            console.log("Limited recipes:", limitedRecipes);

            // Wait 2 seconds before showing results, using delay
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

// Notebook storage in localStorage
let notebook = JSON.parse(localStorage.getItem('notebook')) || [];

// Save recipe to notebook
function saveToNotebook(recipe, callback) {
    const alreadySaved = notebook.find(fav => fav.idMeal === recipe.idMeal);

    if (!alreadySaved) {
        notebook.push(recipe);
        localStorage.setItem('notebook', JSON.stringify(notebook));
        displayNotebook(notebook, notebookContainer, deleteFromNotebook);

        console.log('Notebook after saving:', notebook);

        // Run callback if provided
        if (typeof callback === 'function') {
            callback(null, recipe); // success: no error, return recipe
        }
    } else {
        // Run callback with error
        if (typeof callback === 'function') {
            callback(new Error(`${recipe.strMeal} is already in your notebook. Have you cooked it yet?`), null);
        }
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
    console.log('Notebook after deletion:', notebook);
    displayNotebook(notebook, notebookContainer, deleteFromNotebook);
}