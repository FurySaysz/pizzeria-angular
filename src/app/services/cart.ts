import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Pizza } from '../models/pizza';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'pizzeria-cart';

  private cartItems: CartItem[] = this.loadCart();

  private cartSubject = new BehaviorSubject<CartItem[]>(
    [...this.cartItems]
  );

  cartItems$ = this.cartSubject.asObservable();

  addToCart(pizza: Pizza): void {
    const existingItem = this.cartItems.find(
      (item) => item.pizza.id === pizza.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        pizza,
        quantity: 1
      });
    }

    this.updateCart();
  }

  increaseQuantity(pizzaId: string): void {
    const item = this.cartItems.find(
      (cartItem) => cartItem.pizza.id === pizzaId
    );

    if (item) {
      item.quantity++;
      this.updateCart();
    }
  }

  decreaseQuantity(pizzaId: string): void {
    const item = this.cartItems.find(
      (cartItem) => cartItem.pizza.id === pizzaId
    );

    if (item && item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  private updateCart(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.cartItems)
    );

    this.cartSubject.next([...this.cartItems]);
  }

  private loadCart(): CartItem[] {
    const savedCart = localStorage.getItem(this.storageKey);

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