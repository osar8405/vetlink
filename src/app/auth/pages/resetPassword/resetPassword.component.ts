import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@core/utils/form-utils';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './resetPassword.component.html',
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  loading = false;
  authService = inject(AuthService);
  notificacion = inject(NotificacionService);
  private route = inject(ActivatedRoute);

  vista = signal(1);

  leyenda =
    this.vista() === 1
      ? 'Ingrese la dirección de correo electrónico de su cuenta de usuario y le enviaremos un enlace de restablecimiento de contraseña.'
      : 'otro';

  myForm = this.fb.group({
    email: ['', Validators.required],
  });

  resetForm = this.fb.group({
    email: [''],
    token: [''],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      this.vista.set(2);
      this.resetForm.patchValue({ email, token });
    }
  }

  onSubmit() {
    this.vista() === 1 ? this.forgotPassword() : this.resetPassword();
  }

  forgotPassword() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.sendForgotPassword(this.myForm.value.email!).subscribe({
      next: (data) => {
        if (data.status) {
          this.resetForm.patchValue({ email: this.myForm.value.email! });
          this.vista.set(2);
        }
      },
      error: (error) => {
        this.loading = false;
        this.notificacion.show(
          'Ocurrio un error al enviar el correo, inténtelo nuevamente',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.resetPassword(this.resetForm.value.email!, this.resetForm.value.token!, this.resetForm.value.newPassword!).subscribe({
      next: (data) => {
        if (data.status) {
        }
      },
      error: (error) => {
        this.loading = false;
        this.notificacion.show(
          'Ocurrio un error al enviar el correo, inténtelo nuevamente',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
