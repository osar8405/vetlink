import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'clinicas',
        loadChildren: () => import('./clinicas/clinicas.routes'),
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'clinicas',
  },
];

export default AdminRoutes;
