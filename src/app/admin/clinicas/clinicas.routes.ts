import { Routes } from '@angular/router';
import { ClinicasListComponent } from './pages/clinicas-list/clinicas-list.component';
import { ClinicasUpdateComponent } from './pages/clinicas-update/clinicas-update.component';

export const ClinicasRoutes: Routes = [
  {
    path: '',
    component: ClinicasListComponent,
  },
  {
    path: ':id',
    component: ClinicasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default ClinicasRoutes;
