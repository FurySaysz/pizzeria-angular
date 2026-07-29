import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { PizzaService } from '../../services/pizza';
import { Pizza } from '../../models/pizza';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-order-pizza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-pizza.html',
  styleUrl: './order-pizza.css'
})
export class OrderPizza implements OnInit {
  pizzas: Pizza[] = [];

 constructor(
  private pizzaService: PizzaService,
  private cartService: CartService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => {
        this.pizzas = data.map((pizza) => ({
          ...pizza,
          price: Number(pizza.price)
        }));

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Unable to load pizzas:', error);
      }
    });
  }

  addToCart(pizza: Pizza): void {
  this.cartService.addToCart(pizza);
  alert(`${pizza.name} added to cart`);
}
}