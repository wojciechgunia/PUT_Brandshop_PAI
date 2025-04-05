import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketProductComponent } from './basket-product.component';

describe('BasketProductComponent', () => {
  let component: BasketProductComponent;
  let fixture: ComponentFixture<BasketProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasketProductComponent]
    });
    fixture = TestBed.createComponent(BasketProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
