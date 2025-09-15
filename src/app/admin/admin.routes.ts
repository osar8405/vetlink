import { Routes } from '@angular/router';

export const AdminRoutes: Routes = [
  {
    path: 'clinicas',
    loadChildren: () => import('./clinicas/clinicas.routes'),
  },
  {
    path: '**',
    redirectTo: 'clinicas',
  },
];

export default AdminRoutes;
