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
    const randomRecipes = await getRandomRecipes(3);
    displayRecipes(randomRecipes, results, saveToNotebook);
    displayNotebook(notebook, notebookContainer, deleteFromNotebook);
});

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

    const recipes = await getRecipesByIngredient(ingredient);
    if (recipes && recipes.length > 0) {
        const limitedRecipes = recipes.slice(0, 3);
        displayRecipes(limitedRecipes, results, saveToNotebook);
    } else {
        results.innerHTML = '<p>No recipes found for that ingredient.</p>';
    }
});

// Clear search results
clearBtn.addEventListener('click', () => {
    results.innerHTML = '';
});

// Refresh random recipes
refreshBtn.addEventListener('click', async () => {
    const randomRecipes = await getRandomRecipes(3);
    displayRecipes(randomRecipes, results, saveToNotebook);
});