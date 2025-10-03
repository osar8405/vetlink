import { Component, inject, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PersonasService } from '../../services/personas.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-personas-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    ConfirmModalComponent,
  ],
  templateUrl: './personas-list.component.html',
})
export class PersonasListComponent {
  personasService = inject(PersonasService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  personaId: string = '0';

  personasResource = rxResource({
    loader: () => {
      return this.personasService.obtienePersonas().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la lista de personas.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.personasResource.reload();
  }

  abrirModal(personaId: string) {
    this.personaId = personaId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${personaId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaPersona() {
    this.personasService.eliminaPersona(this.personaId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Persona eliminada correctamente', 'success');
          this.personasResource.update((personas) => {
            return personas?.filter((persona) => persona.id !== this.personaId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la persona', 'error');
      },
    });
  }
}
