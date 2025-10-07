import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PersonasService } from '../../services/personas.service';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { IconDeleteComponent } from '@shared/icons/icon-delete/icon-delete.component';
import { IconEditComponent } from '@shared/icons/icon-edit/icon-edit.component';

@Component({
  selector: 'app-personas-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    IconDeleteComponent,
    IconEditComponent,
  ],
  templateUrl: './personas-list.component.html',
})
export class PersonasListComponent {
  personasService = inject(PersonasService);
  notificacion = inject(NotificacionService);

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

  eliminaRegistro(registroId: string) {
    this.personasService.eliminaPersona(registroId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Persona eliminada correctamente', 'success');
          this.personasResource.update((personas) => {
            return personas?.filter((persona) => persona.id !== registroId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la persona', 'error');
      },
    });
  }
}
