import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'shared-direccion',
  imports: [FormErrorLabelComponent, ReactiveFormsModule],
  templateUrl: './direccion.html',
})
export class Direccion {
  direccionForm = input.required<FormGroup>();
}
