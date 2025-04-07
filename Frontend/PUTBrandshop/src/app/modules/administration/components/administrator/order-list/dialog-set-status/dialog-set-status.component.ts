import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-set-status',
  templateUrl: './dialog-set-status.component.html',
  styleUrls: ['./dialog-set-status.component.scss'],
})
export class DialogSetStatusComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogSetStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { status: string }
  ) {}
  ngOnInit(): void {
    this.statusControl.setValue(this.changeStatusName(this.data.status));
  }

  statusControl = new FormControl<string>('');

  changeStatusName(name: string) {
    switch (name) {
      case 'Zamówienie złożone': {
        return 'PENDING';
      }

      case 'Oczekuje na potwierdzenie': {
        return 'WAITING_FOR_CONFIRMATION';
      }

      case 'Zamówienie opłacone': {
        return 'PAID';
      }

      case 'Zamówienie anulowane': {
        return 'CANCELED';
      }

      case 'Zamówienie wysłane': {
        return 'SENT';
      }

      case 'Zamówienie zrealizowane': {
        return 'DELIVERED';
      }

      case 'Zamówienie zwrócone': {
        return 'RETURNED';
      }

      default:
        return '';
    }
  }
}
