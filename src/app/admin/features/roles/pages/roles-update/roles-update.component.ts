import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormUtils } from '@core/utils/form-utils';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles-update.component',
  imports: [NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent],
  templateUrl: './roles-update.component.html',
})
export class RolesUpdateComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  location = inject(Location);
  rolesService = inject(RolesService);
  notificacion = inject(NotificacionService);
  private activatedRoute = inject(ActivatedRoute);

  rolId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.rolId() === 'new' ? false : true;
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
  });

  rolesResource = this.isEditMode
    ? rxResource({
      request: () => ({}),
      loader: () => {
        return this.rolesService
          .obtieneRol(this.rolId())
          .pipe(
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
    if (this.isEditMode && this.rolesResource) {
      effect(() => {
        const data = this.rolesResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(rol: any) {
    this.myForm.patchValue({
      id: rol.id,
      name: rol.name,
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
      ? this.rolesService.actualizaRol(this.myForm.value)
      : this.rolesService.nuevoRol(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Rol actualizado correctamente.'
              : 'Rol guardado correctamente.',
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
            ? 'Ocurrió un error al actualizar el rol, favor de intentarlo nuevamente'
            : 'Ocurrió un error a guardar el rol, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
