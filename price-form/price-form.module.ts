import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceFormComponent } from './price-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [PriceFormComponent],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  exports: [PriceFormComponent],
})
export class PriceFormModule {}
