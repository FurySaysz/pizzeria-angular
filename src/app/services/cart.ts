import { Injectable, signal } from '@angular/core';

import { Pizza } from '../models/pizza';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly storageKey = 'pizzeria-cart';

  private readonly cartItemsSignal = signal<CartItem[]>(
    this.loadCart()
  );

  readonly cartItems = this.cartItemsSignal.asReadonly();

  addToCart(pizza: Pizza): void {
    const items = [...this.cartItemsSignal()];

    const existingItem = items.find(
      item => item.pizza.id === pizza.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.push({
        pizza,
        quantity: 1
      });
    }

    this.updateCart(items);
  }

  increaseQuantity(pizzaId: string | number): void {
    const items = [...this.cartItemsSignal()];

    const item = items.find(
      cartItem => cartItem.pizza.id === pizzaId
    );

    if (item) {
      item.quantity++;
      this.updateCart(items);
    }
  }

  decreaseQuantity(pizzaId: string | number): void {
    const items = [...this.cartItemsSignal()];

    const item = items.find(
      cartItem => cartItem.pizza.id === pizzaId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(items);
    } else {
      this.updateCart(
        items.filter(
          cartItem => cartItem.pizza.id !== pizzaId
        )
      );
    }
  }

  removeItem(pizzaId: string | number): void {
    const updatedItems = this.cartItemsSignal().filter(
      item => item.pizza.id !== pizzaId
    );

    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(items)
    );

    this.cartItemsSignal.set([...items]);
  }

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem(
      this.storageKey
    );

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart) as CartItem[];
    } catch {
      return [];
    }
  }
}