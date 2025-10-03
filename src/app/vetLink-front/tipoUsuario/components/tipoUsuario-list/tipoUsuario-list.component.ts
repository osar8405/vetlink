import { Component, inject, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TipoUsuarioService } from '../../services/tipoUsuario.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
@Component({
  selector: 'app-tipo-usuario-list.component.ts',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    ConfirmModalComponent,
  ],
  templateUrl: './tipoUsuario-list.component.html',
})
export class TipoUsuarioListComponent {
  tipoUsuarioService = inject(TipoUsuarioService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  tipoUsuarioId: number = 0;

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

  abrirModal(tipoUsuarioId: number) {
    this.tipoUsuarioId = tipoUsuarioId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${tipoUsuarioId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaTipoUsuario() {
    this.tipoUsuarioService.eliminaTipoUsuario(this.tipoUsuarioId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Registro eliminado correctamente', 'success');
          this.tipoUsuariosResource.update((tipoUsuarios) => {
            return tipoUsuarios?.filter(
              (tipoUsuario) => tipoUsuario.id !== this.tipoUsuarioId
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
