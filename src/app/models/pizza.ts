export interface Pizza {
  id: string | number;
  name: string;
  description: string;
  type: string;
  ingredients: string[];
  topping: string[];
  price: number;
  image: string;

  basePrice?: number;
  ingredientCost?: number;
}