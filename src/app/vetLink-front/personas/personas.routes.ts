import { Routes } from '@angular/router';
import { PersonasListComponent } from './components/personas-list/personas-list.component';
import { PersonasUpdateComponent } from './components/personas-update/personas-update.component';

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
