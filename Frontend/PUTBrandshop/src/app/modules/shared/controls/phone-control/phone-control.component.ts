import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Observable, combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-phone-control',
  templateUrl: './phone-control.component.html',
  styleUrls: ['./phone-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PhoneControlComponent,
      multi: true,
    },
  ],
})
export class PhoneControlComponent implements ControlValueAccessor, OnDestroy {
  numberPrefixControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[+]{0,1}[0-9]{1,2}'),
  ]);
  numberControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[0-9 ]{9,11}'),
  ]);

  onChange = (value: string | null) => {};

  onTouch = () => {};

  sub = new Subscription();

  constructor() {
    this.sub.add(
      combineLatest([
        this.numberPrefixControl.valueChanges,
        this.numberControl.valueChanges,
      ]).subscribe(([prefix, number]) => {
        if (prefix && number) {
          if (prefix[0] != '+') prefix = '+' + prefix;
          this.onChange(`${prefix} ${number}`);
        } else {
          this.onChange(null);
        }
      }),
    );
  }

  writeValue(value: string): void {
    const numberTable = value.split(' ');
    this.numberPrefixControl.setValue(numberTable[0]);
    numberTable[0] = '';
    this.numberControl.setValue(numberTable.join(' ').trim());
  }
  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.numberControl.disable();
      this.numberPrefixControl.disable();
    } else {
      this.numberControl.enable();
      this.numberPrefixControl.enable();
    }
  }

  getError() {
    if (
      (this.numberPrefixControl.hasError('required') ||
        this.numberControl.hasError('required')) &&
      !(
        this.numberPrefixControl.hasError('pattern') ||
        this.numberControl.hasError('pattern')
      )
    )
      return 'Telefon jest wymagany';
    else return 'Telefon musi mieć format +00 000 000 000';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
