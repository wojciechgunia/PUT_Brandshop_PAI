import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { DeliveryFormComponent } from './delivery-form/delivery-form.component';
import { OrderService } from 'src/app/modules/core/services/order.service';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
})
export class OrderCreateComponent {
  errorMsg: string | null = null;
  loading = false;

  @ViewChild(CustomerFormComponent) customerFormComp!: CustomerFormComponent;
  @ViewChild(AddressFormComponent) addressFormComp!: AddressFormComponent;
  @ViewChild(DeliveryFormComponent) deliveryFormComp!: DeliveryFormComponent;
  @ViewChild(PaymentFormComponent) paymentFormComp!: PaymentFormComponent;

  constructor(
    private location: Location,
    private router: Router,
    private orderService: OrderService,
    private notifier: NotifierService
  ) {}

  OnInit(): void {
    const locationState = this.location.getState() as {
      summaryPrice: undefined | number;
      navigationId: number;
    };
    if (!locationState.summaryPrice) {
      this.router.navigate(['/']);
    }
  }

  order() {
    // console.log(this.customerFormComp.customerForm);
    // console.log(this.addressFormComp.addressForm);
    // console.log(this.deliveryFormComp.deliverForm);
    if (
      this.customerFormComp.customerForm.valid &&
      this.addressFormComp.addressForm.valid &&
      this.deliveryFormComp.deliverForm.valid &&
      this.paymentFormComp.paymentForm.valid
    ) {
      this.loading = true;
      this.orderService
        .addOrder({
          address: this.addressFormComp.addressForm.getRawValue(),
          deliver: this.deliveryFormComp.deliverForm.getRawValue(),
          customerDetails: this.customerFormComp.customerForm.getRawValue(),
          payment: this.paymentFormComp.paymentForm.getRawValue(),
        })
        .subscribe({
          next: () => {
            this.notifier.notify('success', 'Zamówienie zostało złożone');
            this.loading = false;
          },
          error: (err) => {
            this.errorMsg = err;
            this.loading = false;
          },
        });
    }
  }
}
