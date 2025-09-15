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
@Component({
  selector: 'app-clinicas-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    ConfirmModalComponent,
  ],
  templateUrl: './clinicas-list.component.html',
})
export class ClinicasListComponent {
  clinicasService = inject(ClinicasService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  hotelId: number = 0;

  clinicasResource = rxResource({
    loader: () => {
      return this.clinicasService
        .obtieneClinicas()
        .pipe(
          map((resp) => resp.response.map(hotel => ({
            ...hotel, imagen: `${hotel.imagen}?n=${Math.random()}`
          }))),
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

  abrirModal(hotelId: number) {
    this.hotelId = hotelId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${hotelId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaClinica() {
    this.clinicasService.eliminaClinica(this.hotelId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Clinica eliminada correctamente', 'success');
          this.clinicasResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.hotelId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la clinica', 'error');
      },
    });
  }
}
