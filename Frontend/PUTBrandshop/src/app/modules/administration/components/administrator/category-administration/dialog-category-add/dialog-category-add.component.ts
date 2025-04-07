import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-category-add',
  templateUrl: './dialog-category-add.component.html',
  styleUrls: ['./dialog-category-add.component.scss'],
})
export class DialogCategoryAddComponent {
  constructor(public dialogRef: MatDialogRef<DialogCategoryAddComponent>) {}

  nameControl = new FormControl<string>('');
}
