import { Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { CatalogosListComponent } from './components/catalogos-list/catalogos-list.component';
import { CatalogosUpdateComponent } from './components/catalogos-update/catalogos-update.component';

export const CatalogosRoutes: Routes = [
  {
    path: ':nombreCatalogo',
    component: CatalogosListComponent,
  },
  {
    path: ':nombreCatalogo/:id/edit',
    component: CatalogosUpdateComponent,
  },
  {
    path: ':nombreCatalogo/new',
    component: CatalogosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default CatalogosRoutes;
