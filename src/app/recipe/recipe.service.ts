import { EventEmitter } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredients.model";
import { Subject } from "rxjs";

export class RecipeService {
    // recipeSelected = new Subject <Recipe>();
    recipesChanged = new Subject <Recipe[]>();

    // private recipes: Recipe[] = [ 
    //     new Recipe('A Test Recipe', 'This is simply a test', 
    //     'https://www.howtocook.recipes/wp-content/uploads/2021/05/Ratatouille-recipe.jpg', 
    //     [
    //         new Ingredient('Veggies', 20),
    //         new Ingredient('Oil', 2)
    //     ]),
    //     new Recipe('Another Test Recipe', 'This is simply a test1', 
    //     'https://handletheheat.com/wp-content/uploads/2017/03/cream-cheese-frosting-recipe-SQUARE.jpg',
    //     [
    //         new Ingredient('Egg', 5),
    //         new Ingredient('Butter', 2)
    //     ])
    //   ];

    private recipes: Recipe[] = [];

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}