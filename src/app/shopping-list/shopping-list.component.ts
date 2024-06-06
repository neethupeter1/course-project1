import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppinglistService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[];
    private igChangeSub: Subscription;
  // ingredients: Ingredient[] = [
  //   new Ingredient('Apple', 5),
  //   new Ingredient('Tomatoes', 10)
  // ];

  constructor(private shoppinglistSer: ShoppinglistService, private loggingService: LoggingService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppinglistSer.getIngredients();
    this.igChangeSub = this.shoppinglistSer.ingredientChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    )

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  onIngredientAdded(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }

  onEditItem(index: number) {
    this.shoppinglistSer.startedEditting.next(index);
  }

  ngOnDestroy(): void {
    // this.igChangeSub.unsubscribe();
  }
}
