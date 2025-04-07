import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from 'src/app/modules/core/models/image.model';
import { ImageService } from 'src/app/modules/core/services/image.service';

@Component({
  selector: 'app-uploaded-images',
  templateUrl: './uploaded-images.component.html',
  styleUrls: ['./uploaded-images.component.scss'],
})
export class UploadedImagesComponent {
  @Input() imageUrls: Image[] = [];
  @Output() deleteImageUrl = new EventEmitter<Image[]>();

  errorMsg: string | null = null;

  constructor(private imageService: ImageService) {}

  deleteImage(url: string) {
    this.imageUrls = this.imageUrls.filter((image) => image.url != url);
    this.deleteImageUrl.emit([...this.imageUrls]);
  }
}
