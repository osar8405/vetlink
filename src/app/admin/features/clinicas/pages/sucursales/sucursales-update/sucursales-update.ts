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
import { Sucursal } from '../../../interfaces/sucursales.interface';
import { SucursalesService } from '../../../services/sucursales.service';

@Component({
  selector: 'app-sucursales-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './sucursales-update.html',
})
export class SucursalesUpdate {
  sucursalesService = inject(SucursalesService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  sucursalId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.sucursalId() === 'new' ? false : true;
  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreClinica: ['', Validators.required],
    logo: ['', [Validators.required]],
    sitioWeb: ['', Validators.required],
    activo: [true],
    suscripcionId: [0],
  });

  sucursalResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.sucursalesService.obtieneSucursalPorId(this.sucursalId()).pipe(
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
    if (this.isEditMode && this.sucursalResource) {
      effect(() => {
        const data = this.sucursalResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(clinica: any): void {
    this.myForm.patchValue({
      id: clinica.id,
      nombreClinica: clinica.nombreClinica,
      logo: clinica.logo,
      sitioWeb: clinica.sitioWeb,
      activo: clinica.activo,
      suscripcionId: clinica.suscripcionId,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      if (!this.selectedFile.type.match('image.*')) {
        alert('Solo se permiten imágenes');
        return;
      }
      this.myForm.patchValue({
        imagen: this.selectedFile,
        url: '',
      });
      this.myForm.get('imagen')?.markAsTouched();
      this.myForm.get('imagen')?.updateValueAndValidity();

      this.previewImage(this.selectedFile);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  limpiarImagen(inputRef: HTMLInputElement): void {
    this.imagePreview = null;
    inputRef.value = '';
    this.selectedFile = null;
    this.myForm.patchValue({
      imagen: null,
      url: null,
    });
    this.myForm.get('imagen')?.updateValueAndValidity();
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
      this.cdnService.uploadFile('sucursal', nombreImagen, file).subscribe({
        next: (data) => {
          this.myForm.patchValue({
            url: data.response,
          });
        },
        error: (e) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la foto de la sucursal, favor de intentarlo nuevamente',
            'error'
          );
        },
        complete: () => {
          this.registraSucursal();
        },
      });
    } else {
      this.registraSucursal();
    }
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
            ? 'Ocurrio un error al actualizar la sucursal, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la sucursal, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
