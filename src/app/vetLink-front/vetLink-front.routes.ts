import { Routes } from "@angular/router";
import { VetLinkFrontLayoutComponent } from "./layouts/vetLink-front-layout/vetLink-front-layout.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";


export const vetLinkFrontRoutes: Routes = [
  {
    path: '',
    component: VetLinkFrontLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: HomePageComponent
      },
      {
        path: 'personas',
        loadChildren: () => import('../vetLink-front/personas/personas.routes'),
      },
      {
        path: 'tipo-usuario',
        loadChildren: () =>
          import('../vetLink-front/tipoUsuario/tipoUsuario.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  }
];
export default vetLinkFrontRoutes;
