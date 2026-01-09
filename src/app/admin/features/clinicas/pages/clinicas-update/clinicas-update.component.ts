import { Component, effect, inject, signal } from '@angular/core';
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
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import type { Clinica } from '../../interfaces/clinicas.interface';
import { ClinicasService } from '../../services/clinicas.service';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { Sucursal } from '../../interfaces/sucursales.interface';
import { SucursalesService } from '../../services/sucursales.service';
import { SelectFileComponent } from '@shared/components/upload-file/select-file.component';
@Component({
  selector: 'app-clinicas-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    SelectFileComponent,
  ],
  templateUrl: './clinicas-update.component.html',
})
export class ClinicasUpdateComponent {
  clinicasService = inject(ClinicasService);
  sucursalesService = inject(SucursalesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  clinicaId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.clinicaId() === 'new' ? false : true;

  // Sucursales
  sucursales = signal<Sucursal[]>([]);
  sucursalSeleccionadaId = signal<number | null>(null);
  sucursalSeleccionada = signal<Sucursal | null>(null);

  myForm: FormGroup = this.fb.group({
    id: [0],
    suscripcion: [null],
    sucursales: [[]],
    nombreClinica: ['', Validators.required],
    sitioWeb: ['', Validators.required],
    logo: [''],
    url: [''],
    activo: [true],
    suscripcionId: [0],
  });

  clinicaResource = this.isEditMode
    ? rxResource({
        request: () => ({
          clinicaId: this.clinicaId(),
        }),
        loader: ({ request }) => {
          return this.clinicasService.obtieneClinica(request.clinicaId).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
              this.sucursales.set(resp.response.sucursales);
            })
          );
        },
      })
    : null;

  constructor() {
    if (this.isEditMode && this.clinicaResource) {
      effect(() => {
        const data = this.clinicaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }

    effect(() => {
      const id = this.sucursalSeleccionadaId();
      if (id) {
        const sucursalEncontrada = this.sucursales().find((s) => s.id === id);
        this.sucursalSeleccionada.set(sucursalEncontrada || null);
      }
    });
  }

  private llenaFormulario(clinica: Clinica): void {
    this.myForm.patchValue({
      id: clinica.id,
      nombreClinica: clinica.nombreClinica,
      suscripcion: clinica.suscripcion,
      sucursales: clinica.sucursales,
      logo: clinica.logo,
      url: clinica.logo,
      sitioWeb: clinica.sitioWeb,
      activo: clinica.activo,
      suscripcionId: clinica.suscripcionId,
    });
    this.imagePreview = `${clinica.logo}?n=${Math.random()}`;
  }

  onFileSelected(file: File | null): void {
    this.myForm.patchValue({
      logo: file,
      url: '',
    });
    this.myForm.get('logo')?.markAsTouched();
    this.myForm.get('logo')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    // if (this.myForm.get('imagen')?.value && !this.myForm.get('url')?.value) {
    //   const nombreImagen = `${this.myForm.get('id')?.value}-${String(
    //     Date.now()
    //   ).substring(0, 10)}`;
    //   const file: File = this.myForm.controls['imagen'].value;
    //   this.cdnService.uploadFile('clinica', nombreImagen, file).subscribe({
    //     next: (data) => {
    //       this.myForm.patchValue({
    //         url: data.response,
    //       });
    //     },
    //     error: (e) => {
    //       this.notificacion.show(
    //         'Ocurrió un error al cargar la foto de la clinica, favor de intentarlo nuevamente',
    //         'error'
    //       );
    //     },
    //     complete: () => {
    //       this.registraClinica();
    //     },
    //   });
    // } else {
    this.registraClinica();
    // }
  }

  registraClinica() {
    const request$ = this.isEditMode
      ? this.clinicasService.actualizaClinica(this.myForm.value)
      : this.clinicasService.nuevaClinica(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Clinica actualizada correctamente.'
              : 'Clinica guardada correctamente.',
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
            ? 'Ocurrió un error al actualizar la clinica, favor de intentarlo nuevamente'
            : 'Ocurrió un error a guardar la clinica, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }

  onSucursalChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sucursalSeleccionadaId.set(Number(select.value));
  }
}
