import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { OrderPizza } from './pages/order-pizza/order-pizza';
import { BuildPizza } from './pages/build-pizza/build-pizza';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'order-pizza', component: OrderPizza },
  { path: 'build-pizza', component: BuildPizza },
  { path: 'cart', component: Cart },
  { path: '**', redirectTo: '' }
];