import { ActivatedRoute, Router } from '@angular/router';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { AuthService } from '../../services/auth.service';
import { FormUtils } from '@core/utils/form-utils';
import { NotificacionService } from '@shared/services/notificacion.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, AlertComponent],
  templateUrl: './resetPassword.component.html',
})
export class ResetPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  notificacion = inject(NotificacionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  formUtils = FormUtils;
  loading = false;
  vista = signal(1);

  leyenda = computed(() => {
    return this.vista() === 1
      ? 'Ingrese la dirección de correo electrónico de su cuenta de usuario y le enviaremos un enlace de restablecimiento de contraseña.'
      : 'Ingrese el nuevo password que desea establecer para su cuenta.';
  });

  myForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
  });

  resetForm = this.fb.group({
    email: [''],
    token: [''],
    newPassword: ['', FormUtils.passwordValidator()],
  });

  get passwordErrors() {
    return this.resetForm.get('newPassword')!.errors ?? {};
  }

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
          this.notificacion.show(
            'Te hemos enviado un correo electrónico con instrucciones para restablecer su contraseña',
            'success'
          );
          this.myForm.reset();
        }
      },
      error: (error) => {
        this.loading = false;
        console.log('Error recibido: ', error);
        this.notificacion.show(
          error.error
            ? error.error.message[0]
            : 'Ocurrió un error al enviar el correo, inténtelo nuevamente',
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
    this.authService
      .resetPassword(
        this.resetForm.value.email!,
        this.resetForm.value.token!,
        this.resetForm.value.newPassword!
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.notificacion.show(
              'Su contraseña ha sido restablecida con éxito, ya puede iniciar sesión con su nueva contraseña.',
              'success'
            );
            this.router.navigateByUrl('/auth/login');
          }
        },
        error: (error) => {
          this.loading = false;
          this.notificacion.show(
            'Ocurrió un error al restablecer la contraseña, inténtelo nuevamente',
            'error'
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
