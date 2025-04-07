import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSetStatusComponent } from './dialog-set-status.component';

describe('DialogSetStatusComponent', () => {
  let component: DialogSetStatusComponent;
  let fixture: ComponentFixture<DialogSetStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSetStatusComponent]
    });
    fixture = TestBed.createComponent(DialogSetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
