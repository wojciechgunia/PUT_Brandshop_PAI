import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { QuantityControlComponent } from './controls/quantity-control/quantity-control.component';
import { InputOnlyNumberDirective } from './directives/input-only-number.directive';
import { PhoneControlComponent } from './controls/phone-control/phone-control.component';

@NgModule({
  declarations: [
    AlertComponent,
    QuantityControlComponent,
    InputOnlyNumberDirective,
    PhoneControlComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AlertComponent,
    QuantityControlComponent,
    PhoneControlComponent,
  ],
})
export class SharedModule {}
