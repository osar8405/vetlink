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
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { Sucursal } from '../../../sucursales/interfaces/sucursales.interface';
import { SucursalesService } from '../../../sucursales/services/sucursales.service';
import { SelectFileComponent } from '@shared/components/upload-file/select-file.component';
import { Direccion } from "@shared/direccion/direccion";
import { ClinicasService } from '../../../clinicas/services/clinicas.service';
@Component({
  selector: 'app-sucursales-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    SelectFileComponent,
    Direccion,
  ],
  templateUrl: './sucursales-update.html',
})
export class SucursalesUpdate {
  sucursalesService = inject(SucursalesService);
  clinicasService = inject(ClinicasService);
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

  myForm: FormGroup = this.fb.group({
    id: [0],
    clinicaId: ['', Validators.required],
    nombreSucursal: ['', Validators.required],
    telefono: [''],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    fotoSucursal: [''],
    url: [''],
    horario: [0],
    activo: [true],
    direccion: this.fb.group({
      calle: ['', Validators.required],
      noInt: [''],
      noExt: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      estado: ['', Validators.required],
      cp: [null, Validators.required],
      id: [0],
    }),
  });

  sucursalResource = this.isEditMode
    ? rxResource({
        request: () => ({
          clinicaId: this.clinicaId(),
        }),
        loader: ({ request }) => {
          return this.sucursalesService
            .obtieneSucursalPorId(request.clinicaId)
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

  clinicasResource = rxResource({
    loader: ({}) => {
      return this.clinicasService
        .obtieneClinicas()
        .pipe(map((resp: any) => resp.response));
    },
  });

  constructor() {
    if (this.isEditMode && this.sucursalResource) {
      effect(() => {
        const data = this.sucursalResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(sucursal: Sucursal): void {
    this.myForm.patchValue({
      id: sucursal.id,
      clinicaId: sucursal.clinicaId,
      nombreSucursal: sucursal.nombreSucursal,
      telefono: sucursal.telefono,
      email: sucursal.email,
      fotoSucursal: sucursal.fotoSucursal,
      url: sucursal.fotoSucursal,
      horario: sucursal.horario,
      activo: sucursal.activo,
      direccion: {
        calle: sucursal.direccion?.calle,
        noInt: sucursal.direccion?.noInt,
        noExt: sucursal.direccion?.noExt,
        colonia: sucursal.direccion?.colonia,
        municipio: sucursal.direccion?.municipio,
        estado: sucursal.direccion?.estado,
        cp: sucursal.direccion?.cp,
      },
    });
    this.imagePreview = `${sucursal.fotoSucursal}?n=${Math.random()}`;
  }

  getDireccionForm(): FormGroup {
    return this.myForm.get('direccion') as FormGroup;
  }

  onFileSelected(file: File | null): void {
    this.myForm.patchValue({
      fotoSucursal: file,
      url: '',
    });
    this.myForm.get('fotoSucursal')?.markAsTouched();
    this.myForm.get('fotoSucursal')?.updateValueAndValidity();
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
    //       this.registraSucursal();
    //     },
    //   });
    // } else {
    this.registraSucursal();
    // }
  }

  registraSucursal() {
    const request$ = this.isEditMode
      ? this.sucursalesService.actualizaSucursal(this.myForm.value)
      : this.sucursalesService.nuevaSucursal(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Sucursal actualizada correctamente.'
              : 'Sucursal guardada correctamente.',
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
            ? 'Ocurrió un error al actualizar la sucursal, favor de intentarlo nuevamente'
            : 'Ocurrió un error a guardar la sucursal, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
