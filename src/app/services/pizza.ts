import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pizza } from '../models/pizza';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private readonly pizzasUrl = '/data/pizzas.json';
private readonly ingredientsUrl = '/data/ingredients.json';

  constructor(private http: HttpClient) {}

  getPizzas(): Observable<Pizza[]> {
    return this.http.get<Pizza[]>(this.pizzasUrl);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.ingredientsUrl);
  }
}