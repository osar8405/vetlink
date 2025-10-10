import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./vetLink-front/vetLink-front.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'contactanos',
    loadComponent: () =>
      import('./contactanos/contactanos.component').then(
        (m) => m.ContactanosComponent
      ),
  },
  {
    path: 'acerca-de-nosotros',
    loadComponent: () =>
      import('./acerca/acerca.component').then((m) => m.AcercaComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./servicios/servicios.component').then(
        (m) => m.ServiciosComponent
      ),
  },
  {
    path: 'agendar-cita',
    loadComponent: () =>
      import('./citas/components/agendar-cita/agendar-cita.component').then(
        (m) => m.AgendarCitaComponent
      ),
  },

  {
    path: 'cliente',
    loadComponent: () =>
      import('./cliente/components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
];
