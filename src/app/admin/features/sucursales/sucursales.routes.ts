import { Routes } from '@angular/router';
import { SucursalesList } from './pages/sucursales-list/sucursales-list';
import { SucursalesUpdate } from './pages/sucursales-update/sucursales-update';

export const SucursalesRoutes: Routes = [
  {
    path: '',
    component: SucursalesList,
  },
  {
    path: ':id',
    component: SucursalesUpdate,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default SucursalesRoutes;
