import { Pizza } from './pizza';

export interface CartItem {
  pizza: Pizza;
  quantity: number;
}