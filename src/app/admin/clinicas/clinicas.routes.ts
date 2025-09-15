import { Routes } from '@angular/router';
import { ClinicasListComponent } from './components/clinicas-list/clinicas-list.component';
import { ClinicasUpdateComponent } from './components/clinicas-update/clinicas-update.component';

export const ClinicasRoutes: Routes = [
  {
    path: 'list',
    component: ClinicasListComponent,
  },
  {
    path: ':id/edit',
    component: ClinicasUpdateComponent,
  },
  {
    path: 'new',
    component: ClinicasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default ClinicasRoutes;
