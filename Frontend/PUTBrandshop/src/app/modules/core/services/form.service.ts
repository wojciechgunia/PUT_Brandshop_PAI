import {
  AddProduct,
  AddressForm,
  CategoryForm,
  CustomerForm,
  DeliveryForm,
  LoginForm,
  PaymentForm,
  RecoveryForm,
  RegisterForm,
  ResetForm,
} from './../models/forms.model';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { equivalentValidator } from '../../shared/vaidators/equivalent.validator';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  initLoginForm(): FormGroup<LoginForm> {
    return new FormGroup({
      login: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
        nonNullable: true,
      }),
    });
  }

  initRegisterForm(): FormGroup<RegisterForm> {
    return new FormGroup(
      {
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
        login: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
          nonNullable: true,
        }),
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
          nonNullable: true,
        }),
        repassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
          nonNullable: true,
        }),
      },
      { validators: [equivalentValidator('password', 'repassword')] }
    );
  }

  initRecoveryForm(): FormGroup<RecoveryForm> {
    return new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
    });
  }

  initResetForm(): FormGroup<ResetForm> {
    return new FormGroup({
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
        nonNullable: true,
      }),
      repassword: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
        nonNullable: true,
      }),
    });
  }

  initAddCategoryForm(): FormGroup<CategoryForm> {
    return new FormGroup({
      name: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
        nonNullable: true,
      }),
    });
  }

  initAddProductForm(): FormGroup<AddProduct> {
    return new FormGroup({
      name: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(200)],
        nonNullable: true,
      }),
      mainDesc: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(200)],
        nonNullable: true,
      }),
      descHtml: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      price: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(20)],
        nonNullable: true,
      }),
      category: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(100)],
        nonNullable: true,
      }),
      parameters: new FormArray([
        new FormGroup({
          key: new FormControl('', {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
          }),
          value: new FormControl('', {
            validators: [Validators.required, Validators.maxLength(100)],
            nonNullable: true,
          }),
        }),
      ]),
    });
  }

  initCustomerForm(): FormGroup<CustomerForm> {
    return new FormGroup({
      firstName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      lastName: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      phone: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
    });
  }

  initAddressForm(): FormGroup<AddressForm> {
    return new FormGroup({
      city: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      street: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      number: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      postCode: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)],
        nonNullable: true,
      }),
    });
  }

  initDeliverForm(): FormGroup<DeliveryForm> {
    return new FormGroup({
      uuid: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  initPaymentForm(): FormGroup<PaymentForm> {
    return new FormGroup({
      uuid: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getErrorMessage(typ: string, control: FormControl): string {
    if (typ == 'login') {
      if (control.hasError('required')) {
        return 'Login jest wymagany';
      } else if (control.hasError('minlength')) {
        return 'Login musi mieć co najmniej 3 znaki';
      } else {
        return 'Login może mieć co najwyżej 50 znaków';
      }
    } else if (typ == 'email') {
      if (control.hasError('required')) {
        return 'Email jest wymagany';
      } else {
        return 'Niepoprawny adres email';
      }
    } else if (typ == 'name') {
      if (control.hasError('required')) {
        return 'Nazwa jest wymagana';
      } else if (control.hasError('minlength')) {
        return 'Nazwa musi mieć co najmniej 3 znaki';
      } else {
        return 'Nazwa może mieć co najwyżej 50 znaków';
      }
    } else if (typ == 'productform') {
      if (control.hasError('required')) {
        return 'To pole jest wymagane';
      } else {
        return 'To pole zawiera za dużo znaków';
      }
    } else if (typ == 'customer') {
      if (control.hasError('required')) {
        return 'To pole jest wymagane';
      } else {
        return 'To pole zawiera za dużo znaków';
      }
    } else if (typ == 'customerphone') {
      if (control.hasError('required')) {
        return 'To pole jest wymagane';
      } else {
        return 'Błędny format telefonu';
      }
    } else if (typ == 'address') {
      if (control.hasError('required')) {
        return 'To pole jest wymagane';
      } else {
        return 'To pole zawiera za dużo znaków';
      }
    } else if (typ == 'addresscode') {
      if (control.hasError('required')) {
        return 'To pole jest wymagane';
      } else {
        return 'Kod pocztowy musi mieć format 00-000';
      }
    } else {
      if (control.hasError('required')) {
        return 'Hasło jest wymagane';
      } else if (control.hasError('minlength')) {
        return 'Hasło musi mieć co najmniej 5 znaków';
      } else if (control.hasError('passwordNotEquals')) {
        return 'Hasła nie są takie same';
      } else {
        return 'Hasło może mieć co najwyżej 50 znaków';
      }
    }
  }
}
