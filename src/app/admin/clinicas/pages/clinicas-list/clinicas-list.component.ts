import {
  Component,
  inject,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ClinicasService } from '../../services/clinicas.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { IconEditComponent } from "@shared/icons/icon-edit/icon-edit.component";
import { IconDeleteComponent } from "@shared/icons/icon-delete/icon-delete.component";
@Component({
  selector: 'app-clinicas-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    IconEditComponent,
    IconDeleteComponent,
  ],
  templateUrl: './clinicas-list.component.html',
})
export class ClinicasListComponent {
  clinicasService = inject(ClinicasService);
  notificacion = inject(NotificacionService);

  clinicasResource = rxResource({
    loader: () => {
      return this.clinicasService.obtieneClinicas().pipe(
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
    this.clinicasResource.reload();
  }

  eliminaRegistro(registroId: number) {
    this.clinicasService.eliminaClinica(registroId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Clinica eliminada correctamente', 'success');
          this.clinicasResource.update((clinicas) => {
            return clinicas?.filter((clinica) => clinica.id !== registroId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la clinica', 'error');
      },
    });
  }
}
