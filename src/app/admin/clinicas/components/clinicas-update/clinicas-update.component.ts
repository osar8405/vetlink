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
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import type { Clinica } from '../../interfaces/clinicas.interface';
import { ClinicasService } from '../../services/clinicas.service';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
@Component({
  selector: 'app-clinicas-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './clinicas-update.component.html',
})
export class ClinicasUpdateComponent {
  clinicasService = inject(ClinicasService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  clinicaId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.clinicaId() === 'new' ? false : true;
  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreClinica: ['', Validators.required],
    logo: ['', [Validators.required]],
    sitioWeb: ['', Validators.required],
    activo: [true],
    suscripcionId: [0],
  });

  clinicaResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.clinicasService.obtieneClinica(this.clinicaId()).pipe(
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
    if (this.isEditMode && this.clinicaResource) {
      effect(() => {
        const data = this.clinicaResource!.value();
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
          this.registraClinica();
        },
      });
    } else {
      this.registraClinica();
    }
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
            ? 'Ocurrio un error al actualizar la clinica, favor de intentarlo nuevamente'
            : 'Ocurrio un error a guardar la clinica, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
