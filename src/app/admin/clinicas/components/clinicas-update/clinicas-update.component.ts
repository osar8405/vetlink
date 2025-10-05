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
import type { Clinica } from '../../interfaces/clinicas.interface';
import { ClinicasService } from '../../services/clinicas.service';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
@Component({
  selector: 'app-clinicas-update',
  imports: [NotFoundPageComponent, ReactiveFormsModule, FormErrorLabelComponent],
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
  // clinicaId = this.route.snapshot.params['id'];
  clinicaId = toSignal(this.activatedRoute.params.pipe(
    map(params => params['id'])
  ));
  isEditMode = !!this.clinicaId();
  get direccionForm(): FormGroup {
    return this.myForm.get('direccion') as FormGroup;
  }
  myForm: FormGroup = this.fb.group({
    id: [0],
    nombreClinica: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    activo: [true],
    suscripcionId: [0],
    direccion: this.fb.group({
      calle: ['', Validators.required],
      noInt: [''],
      noExt: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      estado: ['', Validators.required],
      cp: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    }),
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
      email: clinica.email,
      telefono: clinica.telefono,
      activo: clinica.activo,
      suscripcionId: clinica.suscripcionId,
      direccion: {
        calle: clinica.direccion.calle,
        noInt: clinica.direccion.noInt,
        noExt: clinica.direccion.noExt,
        colonia: clinica.direccion.colonia,
        municipio: clinica.direccion.municipio,
        estado: clinica.direccion.estado,
        cp: clinica.direccion.cp,
      },
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
