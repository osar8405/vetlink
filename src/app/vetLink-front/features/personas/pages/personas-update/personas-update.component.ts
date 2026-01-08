import { Component, effect, inject, signal } from '@angular/core';
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
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { PersonasService } from '../../services/personas.service';
import { Persona } from '../../interfaces/personas.interface';
import { SelectFileComponent } from '@shared/components/upload-file/select-file.component';
import { TipoUsuarioService } from '../../../tipoUsuario/services/tipoUsuario.service';
import { Direccion } from '@shared/direccion/direccion';

@Component({
  selector: 'app-personas-update',
  imports: [
    NotFoundPageComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
    SelectFileComponent,
    Direccion,
  ],
  templateUrl: './personas-update.component.html',
  providers: [DatePipe],
})
export class PersonasUpdateComponent {
  personasService = inject(PersonasService);
  tipoUsuarioService = inject(TipoUsuarioService);
  notificacion = inject(NotificacionService);
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  cdnService = inject(CdnService);
  location = inject(Location);
  datePipe = inject(DatePipe);
  formUtils = FormUtils;
  imagePreview: string | null = null;
  personaId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );
  isEditMode = this.personaId() === 'new' ? false : true;
  myForm: FormGroup = this.fb.group({
    id: [],
    usuarioId: [],
    tipoUsuarioId: ['', Validators.required],
    nombre: ['', Validators.required],
    primerApellido: ['', Validators.required],
    segundoApellido: ['', Validators.required],
    genero: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    email: [
      '',
      [Validators.required, Validators.pattern(FormUtils.emailPattern)],
    ],
    numeroIdentificacion: ['', Validators.required],
    telefono: [''],
    imagen: [''],
    direccion: this.fb.group({
      calle: ['', Validators.required],
      noInt: [''],
      noExt: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      estado: ['', Validators.required],
      cp: [null, Validators.required],
      id: [0],
    })
  });

  personaResource = this.isEditMode
    ? rxResource({
        loader: () => {
          return this.personasService.obtienePersona(this.personaId()).pipe(
            tap((resp) => {
              if (!resp.status) {
                throw new Error(resp.message?.[0] || 'Error desconocido');
              }
            })
          );
        },
      })
    : null;

  tipoUsuarioResource = rxResource({
    loader: ({}) => {
      return this.tipoUsuarioService
        .obtieneTipoUsuarios()
        .pipe(map((resp) => resp.response));
    },
  });

  constructor() {
    if (this.isEditMode && this.personaResource) {
      effect(() => {
        const data = this.personaResource!.value();
        if (data?.status) {
          this.llenaFormulario(data.response);
        }
      });
    }
  }

  private llenaFormulario(persona: Persona): void {
    this.myForm.patchValue({
      id: persona.id,
      usuarioId: "",
      tipoUsuarioId: persona.tipoUsuarioId,
      nombre: persona.nombre,
      primerApellido: persona.primerApellido,
      segundoApellido: persona.segundoApellido,
      genero: persona.genero,
      fechaNacimiento: this.datePipe.transform(
        new Date(persona.fechaNacimiento),
        'yyyy-MM-dd'
      ),
      email: persona.email,
      numeroIdentificacion: persona.numeroIdentificacion,
      telefono: persona.telefono,
      imagen: persona.imagen,
      direccion: {
        calle: persona.direccion?.calle,
        noInt: persona.direccion?.noInt,
        noExt: persona.direccion?.noExt,
        colonia: persona.direccion?.colonia,
        municipio: persona.direccion?.municipio,
        estado: persona.direccion?.estado,
        cp: persona.direccion?.cp,
        id: persona.direccion?.id,
      }
    });
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
    //   this.cdnService.uploadFile('persona', nombreImagen, file).subscribe({
    //     next: (data) => {
    //       this.myForm.patchValue({
    //         url: data.response,
    //       });
    //     },
    //     error: (e) => {
    //       this.notificacion.show(
    //         'Ocurrió un error al cargar la foto de la persona, favor de intentarlo nuevamente',
    //         'error'
    //       );
    //     },
    //     complete: () => {
    //       this.registraPersona();
    //     },
    //   });
    // } else {
      this.registraPersona();
    // }
  }

  registraPersona() {
    const request$ = this.isEditMode
      ? this.personasService.actualizaPersona(this.myForm.value)
      : this.personasService.nuevaPersona(this.myForm.value);
    request$.subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            this.isEditMode
              ? 'Persona actualizada correctamente.'
              : 'Persona guardada correctamente.',
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
            ? 'Ocurrió un error al actualizar la persona, favor de intentarlo nuevamente'
            : 'Ocurrió un error al guardar la persona, favor de intentarlo nuevamente',
          'error'
        );
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
