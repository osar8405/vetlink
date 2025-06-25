import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'contactanos',
  imports: [ReactiveFormsModule],
  templateUrl: './contactanos.component.html',
})
export class ContactanosComponent {
  private fb = inject(FormBuilder);

  contactoForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    comentario: ['', Validators.required],
    terminos: [false, Validators.requiredTrue],
  });

  onSubmit() {}
}
