import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppinglistService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput', {static: true}) nameInputRef: ElementRef;
  // @ViewChild('amountInput', {static: true}) amountInputRef: ElementRef;
  // @Output() ingredientAdded = new EventEmitter<Ingredient>();
  @ViewChild('f', { static: true}) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  edittedItemIndex: number;
  edittedItem: Ingredient;

  constructor(private shoppinglistSer: ShoppinglistService) {}

  ngOnInit(): void {  
    this.subscription =  this.shoppinglistSer.startedEditting.subscribe(
      (index: number) => {
        this.edittedItemIndex = index;
        this.editMode = true;
        this.edittedItem = this.shoppinglistSer.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.edittedItem.name,
          amount: this.edittedItem.amount
        })
      }
    );
  }

  onSubmit(form: NgForm) {
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppinglistSer.updateIngredient(this.edittedItemIndex, newIngredient);
    } else {
      this.shoppinglistSer.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.shoppinglistSer.deleteIngredient(this.edittedItemIndex);
    this.onClear();
  }
  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  ngOnDestroy(): void {
    // this.shoppinglistSer.startedEditting.unsubscribe();
  }
}
