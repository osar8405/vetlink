import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { IconEditComponent } from '@shared/icons/icon-edit/icon-edit.component';
import { IconDeleteComponent } from '@shared/icons/icon-delete/icon-delete.component';
import { SucursalesService } from 'src/app/admin/features/sucursales/services/sucursales.service';

@Component({
  selector: 'app-sucursales-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    IconEditComponent,
    IconDeleteComponent,
  ],
  templateUrl: './sucursales-list.html',
})
export class SucursalesList {
  sucursalesService = inject(SucursalesService);
  notificacion = inject(NotificacionService);

  sucursalesResource = rxResource({
    loader: () => {
      return this.sucursalesService.obtieneSucursales().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          console.log('Error: ', error);
          this.notificacion.show(
            'Ocurrió un error al cargar la lista de sucursales.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.sucursalesResource.reload();
  }

  eliminaRegistro(registroId: number) {
    this.sucursalesService.eliminaSucursal(registroId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Sucursal eliminada correctamente', 'success');
          this.sucursalesResource.update((sucursales) => {
            return sucursales?.filter((sucursal) => sucursal.id !== registroId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la sucursal', 'error');
      },
    });
  }
}
