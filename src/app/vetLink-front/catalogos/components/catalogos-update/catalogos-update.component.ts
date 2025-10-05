import { Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormUtils } from '@core/utils/form-utils';
import { NotificacionService } from '@shared/services/notificacion.service';
import { tap } from 'rxjs';
import type { Catalogo } from '../../interfaces/catalogos.iterface';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { CatalogosService } from '../../services/catalogos.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
@Component({
  selector: 'app-catalogos-update',
  imports: [ReactiveFormsModule, NotFoundPageComponent, FormErrorLabelComponent],
  templateUrl: './catalogos-update.component.html',
})
export class CatalogosUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  catalogosService = inject(CatalogosService);
  notificacion = inject(NotificacionService);

  catalogoId = this.route.snapshot.params['id'];
  nombreCatalogo = this.route.snapshot.params['nombreCatalogo'];
  isEditMode = !!this.catalogoId;
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    id: [0],
    descripcion: ['', Validators.required],
  });

  preguntaResource = this.isEditMode
    ? rxResource({
        request: () => ({}),
        loader: () => {
          return this.catalogosService
            .obtieneElemento(this.nombreCatalogo, this.catalogoId)
            .pipe(
              tap((resp) => {
                console.log('Resp preguntas: ', resp);
                if (!resp.status) {
                  throw new Error(resp.message?.[0] || 'Error desconocido');
                }
              })
            );
        },
      })
    : null;

  constructor() {
    if (this.isEditMode && this.preguntaResource) {
      effect(() => {
        const data = this.preguntaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(pregunta: any) {
    this.myForm.patchValue({
      id: pregunta.id,
      descripcion: pregunta.descripcion,
    });
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.registraElemento();
  }

  registraElemento() {
    const request$ = this.isEditMode
      ? this.catalogosService.actualizaElemento(
          this.nombreCatalogo,
          this.myForm.value
        )
      : this.catalogosService.nuevoElemento(
          this.nombreCatalogo,
          this.myForm.value
        );
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Elemento actualizado correctamente.'
              : 'Elemento guardado correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(data.message?.[0], 'error');
        }
      },
      error: (e) => {
        this.notificacion.show(
          this.isEditMode
            ? 'Ocurrio un error al actualizar el elemento, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el elemento, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
