import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedImagesComponent } from './uploaded-images.component';

describe('UploadedImagesComponent', () => {
  let component: UploadedImagesComponent;
  let fixture: ComponentFixture<UploadedImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadedImagesComponent],
    });
    fixture = TestBed.createComponent(UploadedImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
