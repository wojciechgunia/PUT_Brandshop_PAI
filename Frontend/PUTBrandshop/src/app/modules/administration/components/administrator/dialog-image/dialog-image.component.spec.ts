import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImageComponent } from './dialog-image.component';

describe('DialogImageComponent', () => {
  let component: DialogImageComponent;
  let fixture: ComponentFixture<DialogImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogImageComponent]
    });
    fixture = TestBed.createComponent(DialogImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
