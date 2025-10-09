import { Routes } from '@angular/router';
import { VeterinariosListComponent } from './components/veterinarios-list/veterinarios-list.component';
import { VeterinariosUpdateComponent } from './components/veterinarios-update/veterinarios-update.component';

export const VeterinariosRoutes: Routes = [
  {
    path: '',
    component: VeterinariosListComponent,
  },
  {
    path: ':id',
    component: VeterinariosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default VeterinariosRoutes;
