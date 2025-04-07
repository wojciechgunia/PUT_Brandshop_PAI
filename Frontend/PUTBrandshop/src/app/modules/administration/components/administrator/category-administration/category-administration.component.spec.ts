import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAdministrationComponent } from './category-administration.component';

describe('CategoryAdministrationComponent', () => {
  let component: CategoryAdministrationComponent;
  let fixture: ComponentFixture<CategoryAdministrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryAdministrationComponent]
    });
    fixture = TestBed.createComponent(CategoryAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
