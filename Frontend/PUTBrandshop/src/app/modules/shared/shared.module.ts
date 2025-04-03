import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/material.module/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
