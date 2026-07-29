import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPizza } from './order-pizza';

describe('OrderPizza', () => {
  let component: OrderPizza;
  let fixture: ComponentFixture<OrderPizza>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPizza],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderPizza);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
