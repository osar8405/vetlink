import { Routes } from '@angular/router';
import { TipoUsuarioListComponent } from './components/tipoUsuario-list/tipoUsuario-list.component';
import { TipoUsurioUpdateComponent } from './components/tipoUsurio-update/tipoUsurio-update.component';

export const TipoUsuarioRoutes: Routes = [
  {
    path: '',
    component: TipoUsuarioListComponent,
  },
  {
    path: ':id',
    component: TipoUsurioUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default TipoUsuarioRoutes;
