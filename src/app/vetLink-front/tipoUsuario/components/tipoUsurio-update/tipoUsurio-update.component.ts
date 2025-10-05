import { Component, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, subscribeOn, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import type { TipoUsuario } from '../../interfaces/tipoUsuario.interface';
import { TipoUsuarioService } from '../../services/tipoUsuario.service';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
@Component({
  selector: 'app-tipo-usurio-update.component.ts',
  imports: [NotFoundPageComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './tipoUsurio-update.component.html',
})
export class TipoUsurioUpdateComponent {
  tipoUsuarioService = inject(TipoUsuarioService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  tipoUsuarioId = toSignal(this.activatedRoute.params.pipe(
    map(params => params['id'])
  ));
  isEditMode = this.tipoUsuarioId() === 'new' ? false : true;
  myForm: FormGroup = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
   
  });

  tipoUsuarioResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.tipoUsuarioService.obtieneTipoUsuario(this.tipoUsuarioId()).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          );
        },
      })
    : null;

  constructor() {
    if (this.isEditMode && this.tipoUsuarioResource) {
      effect(() => {
        const data = this.tipoUsuarioResource!.value();
        if (data?.status) {
          // this.llenaFormulario(data.response);
          this.setFormValue(data.response);
        }
      });
    }
  }

  private llenaFormulario(tipoUsuario: TipoUsuario): void {
    this.myForm.patchValue({
      id: tipoUsuario.id,
      nombre: tipoUsuario.nombre,
    });
  }
   setFormValue(formLike: Partial<TipoUsuario>) {
    // this.myForm.reset(formLike as any);
    // this.myForm.patchValue({ tags: formLike.tags?.join(',') });
    this.myForm.patchValue(formLike as any);
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
      const nombreImagen = `${this.myForm.get('id')?.value}-${String(
        Date.now()
      ).substring(0, 10)}`;
      const file: File = this.myForm.controls['imagen'].value;
      this.cdnService.uploadFile('clinica', nombreImagen, file).subscribe({
        next: (data) => {
          this.myForm.patchValue({
            url: data.response,
          });
        },
        error: (e) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la foto de la clinica, favor de intentarlo nuevamente',
            'error'
          );
        },
        complete: () => {
          this.registraTipoUsuario();
        },
      });
    } else {
      this.registraTipoUsuario();
    }
  }

  registraTipoUsuario() {
    const request$ = this.isEditMode
      ? this.tipoUsuarioService.actualizaTipoUsuario(this.myForm.value)
      : this.tipoUsuarioService.nuevoTipoUsuario(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Tipo usuario actualizado correctamente.'
              : 'Tipo usuario guardado correctamente.',
            'success'
          );
          this.location.back();
        } else {
          this.notificacion.show(`Error ${data.message[0]}`, 'error');
        }
      },
      error: (e) => {
        this.notificacion.show(
          this.isEditMode
            ? 'Ocurrio un error al actualizar el tipo usuario, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar el tipo usuario, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
