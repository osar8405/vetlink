import { IconEditComponent } from './../../../../../assets/icons/icon-edit/icon-edit.component';
import { IconDeleteComponent } from './../../../../../assets/icons/icon-delete/icon-delete.component';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
// import { IconEditComponent } from '@assets/icons/icon-edit/icon-edit.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';
import { CatalogosService } from '../../services/catalogos.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-catalogos-list',
  imports: [
    RouterLink,
    ConfirmModalComponent,
    IconRefreshComponent,
    IconAddComponent,
    IconEditComponent,
    IconDeleteComponent,
  ],
  templateUrl: './catalogos-list.component.html',
})
export class CatalogosListComponent {
  catalogosService = inject(CatalogosService);
  notificacion = inject(NotificacionService);
  private route = inject(ActivatedRoute);
  catalogoId: number = 0;
  mensajeEliminar = '';
  nombreCatalogo = this.route.snapshot.params['nombreCatalogo'];
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  iconoEditar = signal<SafeHtml | undefined>(undefined);
  iconoEliminar = signal<SafeHtml | undefined>(undefined);

  catalogosResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.catalogosService.obtieneElementos(this.nombreCatalogo).pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar el listado de elementos.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.catalogosResource.reload();
  }

  abrirModal(catalogoId: number) {
    this.catalogoId = catalogoId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${catalogoId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaElemento() {
    this.catalogosService
      .eliminaElemento(this.nombreCatalogo, this.catalogoId)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.catalogosResource.update((catalogos) => {
              return catalogos?.filter(
                (catalogo) => catalogo.id !== this.catalogoId
              );
            });
            this.notificacion.show(
              'Elemento eliminado correctamente',
              'success'
            );
          }
        },
        error: (e) => {
          this.notificacion.show(
            'Ocurrio un error al eliminar el elemento',
            'error'
          );
        },
      });
  }
}
