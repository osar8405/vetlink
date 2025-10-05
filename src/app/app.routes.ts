import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: '',
    loadChildren: () => import('./vetLink-front/vetLink-front.routes'),
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
