import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdministrationComponent } from './product-administration.component';

describe('ProductAdministrationComponent', () => {
  let component: ProductAdministrationComponent;
  let fixture: ComponentFixture<ProductAdministrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAdministrationComponent]
    });
    fixture = TestBed.createComponent(ProductAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
