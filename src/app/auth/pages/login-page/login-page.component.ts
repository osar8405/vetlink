import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormUtils } from '@core/utils/form-utils';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  notificacion = inject(NotificacionService);
  loginError = false;
  loading = false;
  credencialesInvalidas = false;
  formUtils = FormUtils;
  myForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired']) {
        this.muestraAlerta('Tu sesión expiró, vuelve a iniciar sesión', 'warning');
        this.router.navigate([], {
          queryParams: {
            sessionExpired: null,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService.login(this.myForm.value).subscribe({
      next: (data) => {
        console.log(data);
        if (data.status) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.loginError = false;
          this.credencialesInvalidas = true;
          this.muestraAlerta(`Ocurrió un error al iniciar sesión, ${data.message[0]}`, 'error');
        }
      },
      error: (e) => {
        console.error('El error: ', e);
        this.loading = false;
        this.muestraAlerta(
          'Ocurrió un error al iniciar sesión,Inténtelo nuevamente.',
          'error'
        );
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  muestraAlerta(mensaje: string, tipoAlerta: 'error' | 'warning' = 'error') {
    this.notificacion.show(mensaje, tipoAlerta);
  }
}
