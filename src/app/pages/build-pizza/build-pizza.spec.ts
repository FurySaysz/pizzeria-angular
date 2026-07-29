import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPizza } from './build-pizza';

describe('BuildPizza', () => {
  let component: BuildPizza;
  let fixture: ComponentFixture<BuildPizza>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildPizza],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildPizza);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
