import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrarseComponent } from './registrarse/registrarse.component';

export const CuentaRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'registrarse',
    component: RegistrarseComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default CuentaRoutes;
