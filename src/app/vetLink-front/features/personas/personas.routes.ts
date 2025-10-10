import { Routes } from '@angular/router';
import { PersonasListComponent } from './pages/personas-list/personas-list.component';
import { PersonasUpdateComponent } from './pages/personas-update/personas-update.component';

export const PersonasRoutes: Routes = [
  {
    path: '',
    component: PersonasListComponent,
  },
  {
    path: ':id',
    component: PersonasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default PersonasRoutes;
