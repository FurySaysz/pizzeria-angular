import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { PizzaService } from '../../services/pizza';
import { CartService } from '../../services/cart';

import { Ingredient } from '../../models/ingredient';
import { Pizza } from '../../models/pizza';

@Component({
  selector: 'app-build-pizza',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './build-pizza.html',
  styleUrl: './build-pizza.css'
})
export class BuildPizza implements OnInit {

  

  pizzas = signal<Pizza[]>([]);

  ingredients = signal<Ingredient[]>([]);

  selectedPizza = signal<Pizza | null>(null);

  selectedIngredients = signal<Ingredient[]>([]);

  basePizzas = computed<Pizza[]>(() => {
    const pepperoniIngredient =
      this.ingredients().find(
        ingredient =>
          ingredient.name.toLowerCase() === 'pepperoni'
      );

    const pepperoniPizza: Pizza[] =
      pepperoniIngredient
        ? [
            {
              id: 'pepperoni-core',
              name: 'Pepperoni',
              description: 'Pepperoni base pizza',
              type: 'nonveg',
              price: Number(
                pepperoniIngredient.price
              ),
              image: pepperoniIngredient.image,
              ingredients: ['Pepperoni'],
              topping: []
            }
          ]
        : [];

    return [
      ...pepperoniPizza,
      ...this.pizzas()
    ];
  });

  ingredientCost = computed(() =>
    this.selectedIngredients().reduce(
      (total, ingredient) =>
        total + Number(ingredient.price),
      0
    )
  );

  totalCost = computed(() => {
    const pizza = this.selectedPizza();

    if (!pizza) {
      return 0;
    }

    return (
      Number(pizza.price) +
      this.ingredientCost()
    );
  });

  constructor(
    private pizzaService: PizzaService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadPizzas();
    this.loadIngredients();
  }

  private loadPizzas(): void {
    this.pizzaService.getPizzas().subscribe({
      next: (data) => {
        this.pizzas.set(
          data.map((pizza) => ({
            ...pizza,
            price: Number(pizza.price)
          }))
        );
      },
      error: (error) => {
        console.error(
          'Unable to load pizzas:',
          error
        );
      }
    });
  }

  private loadIngredients(): void {
    this.pizzaService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients.set(
          data.map((item: any) => ({
            id: item.id,
            name: item.name ?? item.tname,
            price: Number(item.price),
            image: item.image
          }))
        );
      },
      error: (error) => {
        console.error(
          'Unable to load ingredients:',
          error
        );
      }
    });
  }

  selectPizza(pizza: Pizza): void {
    const currentPizza =
      this.selectedPizza();

    if (currentPizza?.id === pizza.id) {
      this.selectedPizza.set(null);
      this.selectedIngredients.set([]);

      return;
    }

    this.selectedPizza.set(pizza);

    this.selectedIngredients.set([]);
  }

  isPizzaSelected(
    pizzaId: Pizza['id']
  ): boolean {
    return (
      this.selectedPizza()?.id === pizzaId
    );
  }

  isIngredientDisabled(
    ingredient: Ingredient
  ): boolean {
    const basePizza =
      this.selectedPizza();

    if (!basePizza) {
      return true;
    }

    return (
      basePizza.name
        .trim()
        .toLowerCase() ===
      ingredient.name
        .trim()
        .toLowerCase()
    );
  }

  toggleIngredient(
    ingredient: Ingredient,
    event: Event
  ): void {
    const checkbox =
      event.target as HTMLInputElement;

    if (!this.selectedPizza()) {
      checkbox.checked = false;

      alert(
        'Please select a base pizza before adding ingredients.'
      );

      return;
    }

    if (
      this.isIngredientDisabled(
        ingredient
      )
    ) {
      checkbox.checked = false;

      return;
    }

    this.selectedIngredients.update(
      selected => {
        if (checkbox.checked) {
          const alreadySelected =
            selected.some(
              item =>
                item.id === ingredient.id
            );

          if (alreadySelected) {
            return selected;
          }

          return [
            ...selected,
            ingredient
          ];
        }

        return selected.filter(
          item =>
            item.id !== ingredient.id
        );
      }
    );
  }

  isIngredientSelected(
    ingredientId: Ingredient['id']
  ): boolean {
    return this.selectedIngredients().some(
      item =>
        item.id === ingredientId
    );
  }

  buildPizza(): void {
    const basePizza =
      this.selectedPizza();

    const extras =
      this.selectedIngredients();

    if (!basePizza) {
      alert(
        'Please select a base pizza first.'
      );

      return;
    }

    if (extras.length === 0) {
      alert(
        'Please select at least one extra ingredient.'
      );

      return;
    }

    const extraIngredientNames =
      extras.map(
        ingredient =>
          ingredient.name
      );

  const customPizza: Pizza = {
  id: Date.now().toString(),

  name: `${basePizza.name} (Customized)`,

  description:
    `Customized ${basePizza.name} with ` +
    extraIngredientNames.join(', '),

  type: basePizza.type,

  ingredients: [
    ...basePizza.ingredients,
    ...extraIngredientNames
  ],

  topping: extraIngredientNames,

  basePrice: Number(basePizza.price),

  ingredientCost: this.ingredientCost(),

  price:
    Number(basePizza.price) +
    this.ingredientCost(),

  image: basePizza.image
};

console.log('Customized pizza:', customPizza);

this.cartService.addToCart(customPizza);

alert(`${customPizza.name} added to cart!`);

this.selectedPizza.set(null);
this.selectedIngredients.set([]);
  }
}