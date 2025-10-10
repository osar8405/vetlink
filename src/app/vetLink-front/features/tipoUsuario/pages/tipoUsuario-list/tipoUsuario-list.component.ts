import { Component, inject, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconDeleteComponent } from '@shared/icons/icon-delete/icon-delete.component';
import { IconEditComponent } from '@shared/icons/icon-edit/icon-edit.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { RouterLink } from '@angular/router';
import { TipoUsuarioService } from '../../services/tipoUsuario.service';

@Component({
  selector: 'app-tipo-usuario-list.component.ts',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    IconDeleteComponent,
    IconEditComponent,
  ],
  templateUrl: './tipoUsuario-list.component.html',
})
export class TipoUsuarioListComponent {
  tipoUsuarioService = inject(TipoUsuarioService);
  notificacion = inject(NotificacionService);

  tipoUsuariosResource = rxResource({
    loader: () => {
      return this.tipoUsuarioService.obtieneTipoUsuarios().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la lista de clinicas.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.tipoUsuariosResource.reload();
  }

  eliminaRegistro(registroId: number) {
    this.tipoUsuarioService.eliminaTipoUsuario(registroId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Registro eliminado correctamente', 'success');
          this.tipoUsuariosResource.update((tipoUsuarios) => {
            return tipoUsuarios?.filter(
              (tipoUsuario) => tipoUsuario.id !== registroId
            );
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el registro', 'error');
      },
    });
  }
}
