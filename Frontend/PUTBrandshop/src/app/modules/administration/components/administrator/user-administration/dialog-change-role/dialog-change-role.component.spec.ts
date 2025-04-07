import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangeRoleComponent } from './dialog-change-role.component';

describe('DialogChangeRoleComponent', () => {
  let component: DialogChangeRoleComponent;
  let fixture: ComponentFixture<DialogChangeRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogChangeRoleComponent]
    });
    fixture = TestBed.createComponent(DialogChangeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
