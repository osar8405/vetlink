import {
  Component,
  inject,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RolesService } from '../../services/roles.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { IconEditComponent } from "@shared/icons/icon-edit/icon-edit.component";
import { IconDeleteComponent } from "@shared/icons/icon-delete/icon-delete.component";
@Component({
  selector: 'app-roles-list.component',
  imports: [IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    IconEditComponent,
    IconDeleteComponent,],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent {
  rolesService = inject(RolesService);
  notificacion = inject(NotificacionService);

  rolesResource = rxResource({
    loader: () => {
      return this.rolesService.obtieneRoles().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          console.log("Error: ", error);
          this.notificacion.show(
            'Ocurrió un error al cargar la lista de roles.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.rolesResource.reload();
  }

  eliminaRegistro(registroId: string) {
    this.rolesService.eliminaRol(registroId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Rol eliminado correctamente', 'success');
          this.rolesResource.update((clinicas) => {
            return clinicas?.filter((clinica) => clinica.id !== registroId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el rol', 'error');
      },
    });
  }
}
