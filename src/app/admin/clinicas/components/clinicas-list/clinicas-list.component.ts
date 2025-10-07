import {
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ClinicasService } from '../../services/clinicas.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { IconEditComponent } from "@shared/icons/icon-edit/icon-edit.component";
import { IconDeleteComponent } from "@shared/icons/icon-delete/icon-delete.component";
@Component({
  selector: 'app-clinicas-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    ConfirmModalComponent,
    IconEditComponent,
    IconDeleteComponent
],
  templateUrl: './clinicas-list.component.html',
})
export class ClinicasListComponent {
  clinicasService = inject(ClinicasService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  clinicaId: number = 0;

  clinicasResource = rxResource({
    loader: () => {
      return this.clinicasService
        .obtieneClinicas()
        .pipe(
          map((resp) => resp.response),
          catchError(error => {
            this.notificacion.show(
              'Ocurrio un error al cargar la lista de clinicas.',
              'error'
            );
            return of([])
          })
        );
    },
  });

  refrescaDatos() {
    this.clinicasResource.reload();
  }

  abrirModal(clinicaId: number) {
    this.clinicaId = clinicaId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${clinicaId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaClinica() {
    this.clinicasService.eliminaClinica(this.clinicaId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Clinica eliminada correctamente', 'success');
          this.clinicasResource.update((clinicas) => {
            return clinicas?.filter((clinica) => clinica.id !== this.clinicaId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la clinica', 'error');
      },
    });
  }
}
