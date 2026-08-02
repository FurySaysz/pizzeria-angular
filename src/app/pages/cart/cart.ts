import {
  Component,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  readonly cartItems = computed(
    () => this.cartService.cartItems()
  );

  readonly ingredientsTotal = computed(() =>
    this.cartItems().reduce(
      (total, item) =>
        total +
        Number(item.pizza.ingredientCost ?? 0) *
          item.quantity,
      0
    )
  );

  readonly pizzaTotal = computed(() =>
    this.cartItems().reduce(
      (total, item) => {
        const completePrice =
          Number(item.pizza.price);

        const ingredientPrice =
          Number(item.pizza.ingredientCost ?? 0);

        const basePizzaPrice =
          completePrice - ingredientPrice;

        return (
          total +
          basePizzaPrice * item.quantity
        );
      },
      0
    )
  );

  readonly grandTotal = computed(
    () =>
      this.pizzaTotal() +
      this.ingredientsTotal()
  );

  constructor(
    private cartService: CartService
  ) {}

  increaseQuantity(
    pizzaId: string | number
  ): void {
    this.cartService.increaseQuantity(
      pizzaId
    );
  }

  decreaseQuantity(
    pizzaId: string | number
  ): void {
    this.cartService.decreaseQuantity(
      pizzaId
    );
  }

  removeItem(
    pizzaId: string | number
  ): void {
    this.cartService.removeItem(
      pizzaId
    );
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  payNow(): void {
    if (this.cartItems().length === 0) {
      alert('Your cart is empty.');
      return;
    }

    alert('Order placed successfully!');

    this.cartService.clearCart();
  }
}