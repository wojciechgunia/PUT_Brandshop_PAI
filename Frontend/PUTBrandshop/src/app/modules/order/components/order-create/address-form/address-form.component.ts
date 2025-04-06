import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressForm } from 'src/app/modules/core/models/forms.model';
import { FormService } from 'src/app/modules/core/services/form.service';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent {
  addressForm: FormGroup<AddressForm> = this.formService.initAddressForm();

  constructor(private formService: FormService) {}

  get controls() {
    return this.addressForm.controls;
  }

  getErrorMessage(typ: string, control: FormControl): string {
    return this.formService.getErrorMessage(typ, control);
  }
}
