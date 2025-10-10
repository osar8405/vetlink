import { Routes } from '@angular/router';
import { VetLinkFrontLayoutComponent } from './layouts/vetLink-front-layout/vetLink-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const vetLinkFrontRoutes: Routes = [
  {
    path: '',
    component: VetLinkFrontLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: HomePageComponent,
      },
      {
        path: 'personas',
        loadChildren: () => import('./features/personas/personas.routes'),
      },
      {
        path: 'tipo-usuario',
        loadChildren: () =>
          import('./features/tipoUsuario/tipoUsuario.routes'),
      },
      {
        path: 'veterinarios',
        loadChildren: () =>
          import('../admin-clinicas/features/veterinarios/veterinarios.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
export default vetLinkFrontRoutes;
