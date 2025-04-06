import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaymentForm } from 'src/app/modules/core/models/forms.model';
import { GetPayment } from 'src/app/modules/core/models/payment.model';
import { FormService } from 'src/app/modules/core/services/form.service';
import { PaymentService } from 'src/app/modules/core/services/payment.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent {
  paymentForm: FormGroup<PaymentForm> = this.formService.initPaymentForm();
  payments: GetPayment[] = [];
  error: string | null = null;
  selected = new EventEmitter<string>();

  constructor(
    private formService: FormService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.paymentService.getPayment().subscribe({
      next: (payments) => {
        this.payments = [...payments];
      },
      error: (err) => {
        this.error = err;
      },
    });
  }

  get controls() {
    return this.paymentForm.controls;
  }

  getErrorMessage(typ: string, control: FormControl): string {
    return this.formService.getErrorMessage(typ, control);
  }

  select($event: string) {
    this.paymentForm.controls.uuid.setValue($event);
    this.selected.emit($event);
  }
}
