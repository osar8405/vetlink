import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'clinicas',
        loadChildren: () => import('./clinicas/clinicas.routes'),
      },

    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export default AdminRoutes;
