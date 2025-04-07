import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-change-role',
  templateUrl: './dialog-change-role.component.html',
  styleUrls: ['./dialog-change-role.component.scss'],
})
export class DialogChangeRoleComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogChangeRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: string }
  ) {}
  ngOnInit(): void {
    this.roleControl.setValue(this.data.role);
  }

  roleControl = new FormControl<string>('');
}
