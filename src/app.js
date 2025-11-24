// src/app.js
import { getRandomRecipes, getRecipesByIngredient } from './api.js';
import { displayRecipes } from './dom.js';

const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const results = document.getElementById('results');
const notebookContainer = document.getElementById('notebook');

// Fake notebook storage
let notebook = JSON.parse(localStorage.getItem('notebook')) || [];

// Save recipe to notebook
function saveToNotebook(recipe) {
    if (!notebook.find(fav => fav.idMeal === recipe.idMeal)) {
        notebook.push(recipe);
        localStorage.setItem('notebook', JSON.stringify(notebook));
        alert(`${recipe.strMeal} saved to notebook!`);
        displayRecipes(notebook, notebookContainer, deleteFromNotebook);
    } else {
        alert(`${recipe.strMeal} is already in your notebook.`);
    }
}

// Delete recipe from notebook
function deleteFromNotebook(idMeal) {
    const recipeToDelete = notebook.find(fav => fav.idMeal === idMeal);
    notebook = notebook.filter(fav => fav.idMeal !== recipe.idMeal);
    localStorage.setItem('notebook', JSON.stringify(notebook));
    if (recipeToDelete) {
    alert(`${recipeToDelete.strMeal} removed from notebook.`);
    displayRecipes(notebook, notebookContainer, deleteFromNotebook);
}

// Show multiple random recipes on page load
window.addEventListener('load', async () => {
    const randomRecipes = await getRandomRecipes(5);
    displayRecipes(randomRecipes, results, saveToNotebook);
    displayRecipes(notebook, notebookContainer, deleteFromNotebook);
});

// Search recipes by ingredient
searchBtn.addEventListener('click', async () => {
    const ingredient = document.getElementById('ingredientInput').value.trim();
    if (ingredient) {
        const recipes = await getRecipesByIngredient(ingredient);
        displayRecipes(recipes, results, saveToNotebook);
    } else {
        alert('Please enter an ingredient to search.');
    }
});

// Clear search results
clearBtn.addEventListener('click', () => {
    results.innerHTML = '';
});

// Refresh random recipes
refreshBtn.addEventListener('click', async () => {
    const randomRecipes = await getRandomRecipes(5);
    displayRecipes(randomRecipes, results, saveToNotebook);
});
}
