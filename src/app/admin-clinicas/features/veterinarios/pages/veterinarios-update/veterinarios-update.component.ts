import { Component, effect, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CdnService } from '@shared/services/cdn.service';
import { FormUtils } from '@core/utils/form-utils';
import { NotFoundPageComponent } from '@shared/components/not-found-page/not-found-page.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { VeterinariosService } from '../../services/veterinarios.service';
import type { Veterinario } from '../../interfaces/veterinarios.interface';
import { SelectFileComponent } from '@shared/components/upload-file/select-file.component';
@Component({
  selector: 'app-veterinarios-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    SelectFileComponent,
  ],
  providers: [DatePipe],
  templateUrl: './veterinarios-update.component.html',
})
export class VeterinariosUpdateComponent {
  veterinariosService = inject(VeterinariosService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  formUtils = FormUtils;
  datePipe = inject(DatePipe);
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  clinicaId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.clinicaId() === 'new' ? false : true;
  myForm: FormGroup = this.fb.group({
    id: [''],
    persona: this.fb.group({
      id: [''],
      tipoUsuarioId: [''],
      nombre: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      email: [''],
      numeroIdentificacion: [''],
      imagen: [''],
    }),
    cedulaProfesional: ['', Validators.required],
    horarios: ['', Validators.required],
  });

  clinicaResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.veterinariosService
            .obtieneVeterinario(this.clinicaId())
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
    console.log('isEditMode', this.isEditMode);
    if (this.isEditMode && this.clinicaResource) {
      effect(() => {
        const data = this.clinicaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(veterinario: Veterinario): void {
    this.myForm.patchValue({
      id: veterinario.id,
      persona: {
        id: veterinario.persona?.id,
        tipoUsuarioId: veterinario.persona?.tipoUsuarioId,
        nombre: veterinario.persona?.nombre,
        primerApellido: veterinario.persona?.primerApellido,
        segundoApellido: veterinario.persona?.segundoApellido,
        genero: veterinario.persona?.genero,
        fechaNacimiento: this.datePipe.transform(
          new Date(veterinario.persona?.fechaNacimiento || ''),
          'yyyy-MM-dd'
        ),
        email: veterinario.persona?.email,
        numeroIdentificacion: veterinario.persona?.numeroIdentificacion,
        imagen: veterinario.persona?.imagen,
      },
      cedulaProfesional: veterinario.cedulaProfesional,
      horarios: veterinario.horarios,
    });
    this.imagePreview = veterinario.persona?.imagen ?? null;
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

  onFileSelected(file: File | null): void {
    this.myForm.patchValue({
      imagen: file,
      url: '',
    });
    this.myForm.get('imagen')?.markAsTouched();
    this.myForm.get('imagen')?.updateValueAndValidity();
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
      ? this.veterinariosService.actualizaVeterinario(this.myForm.value)
      : this.veterinariosService.nuevoVeterinario(this.myForm.value);
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
}
