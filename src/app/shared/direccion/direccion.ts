import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'shared-direccion',
  imports: [FormErrorLabelComponent, ReactiveFormsModule],
  templateUrl: './direccion.html',
})
export class Direccion {
  private fb = inject(FormBuilder);

  myForm: FormGroup = this.fb.group({
    calle: ['', Validators.required],
    noInt: [''],
    noExt: ['', Validators.required],
    colonia: ['', Validators.required],
    municipio: ['', Validators.required],
    estado: ['', Validators.required],
    cp: [null, Validators.required],
    id: [0],
  });
}
