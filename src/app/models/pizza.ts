export interface Pizza {
  id: string;
  type: 'veg' | 'nonveg';
  price: number;
  name: string;
  image: string;
  description: string;
  ingredients: string[];
  topping: string[];
}