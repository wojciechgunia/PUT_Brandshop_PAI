import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerForm } from 'src/app/modules/core/models/forms.model';
import { FormService } from 'src/app/modules/core/services/form.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent {
  customerForm: FormGroup<CustomerForm> = this.formService.initCustomerForm();

  constructor(private formService: FormService) {}

  get controls() {
    return this.customerForm.controls;
  }

  getErrorMessage(typ: string, control: FormControl): string {
    return this.formService.getErrorMessage(typ, control);
  }
}
