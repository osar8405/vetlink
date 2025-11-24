import { Routes } from '@angular/router';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RolesUpdateComponent } from './pages/roles-update/roles-update.component';


export const ClinicasRoutes: Routes = [
  {
    path: '',
    component: RolesListComponent,
  },
  {
    path: ':id',
    component: RolesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ClinicasRoutes;
