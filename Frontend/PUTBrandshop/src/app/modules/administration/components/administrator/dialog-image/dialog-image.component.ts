import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Image } from 'src/app/modules/core/models/image.model';
import { ImageService } from 'src/app/modules/core/services/image.service';

@Component({
  selector: 'app-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.scss'],
})
export class DialogImageComponent implements OnInit, OnDestroy, AfterViewInit {
  images: Image[] = [];
  selectedImage: Image | null = null;
  selectedFile: File | null = null;
  totalCount = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sub = new Subscription();

  error: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<DialogImageComponent>,
    private imageService: ImageService
  ) {}
  ngAfterViewInit(): void {
    this.sub.add(
      this.paginator.page.subscribe({
        next: () => {
          this.getImagesList();
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getImagesList() {
    if (this.paginator.pageSize > 0 && this.paginator.pageIndex > -1) {
      this.imageService
        .getImages(this.paginator.pageIndex + 1, this.paginator.pageSize)
        .subscribe((response) => {
          this.images = response.images;
          this.totalCount = response.totalCount;
        });
    } else {
      this.imageService.getImages().subscribe((response) => {
        this.images = response.images;
        this.totalCount = response.totalCount;
      });
    }
  }

  ngOnInit(): void {
    this.imageService.getImages().subscribe((response) => {
      this.images = response.images;
      this.totalCount = response.totalCount;
    });
  }

  selectImage(image: Image): void {
    this.selectedImage = image;
  }

  addPhoto() {
    document.getElementById('imageInput')?.click();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.error = null;
      const formData = new FormData();

      formData.append('multipartFile', this.selectedFile);

      this.imageService.addImage(formData).subscribe({
        next: () => {
          this.getImagesList();
        },
        error: (err) => {
          this.error = err;
        },
      });
    }
  }
}
