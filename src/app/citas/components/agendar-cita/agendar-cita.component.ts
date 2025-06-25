import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-agendar-cita',
  imports: [ReactiveFormsModule],
  templateUrl: './agendar-cita.component.html',
})
export class AgendarCitaComponent {
  private fb = inject(FormBuilder);

  myForm = this.fb.group({
    mascota: ['', Validators.required],
    propietario: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    servicio: ['', Validators.required],
    sucursal: ['', Validators.required],
    hora: ['', Validators.required],
    fecha: ['', Validators.required],
    comentarios: ['', Validators.required],
    terminos: [false, Validators.requiredTrue],
  });

  onSubmit() {}
}
