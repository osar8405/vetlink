import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Persona,
  PersonasResponse,
} from '../interfaces/personas.interface';

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private http = inject(HttpClient);

  obtienePersonas(): Observable<PersonasResponse> {
    return this.http
      .get<PersonasResponse>(`${AppConfig.APIREST_URL}/api/Persona/Listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtienePersona(personaId: number): Observable<PersonasResponse> {
    return this.http
      .get<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Detalles/${personaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaPersona(persona: Persona): Observable<PersonasResponse> {
    return this.http
      .post<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Administracion/registrar`,
        {
          id: 'bd751a2f-0f94-4cee-bbc1-08dde64c1ab3',
          usuarioId: '7eaa93f9-04b4-40bb-87b7-07c4481b3f52',
          tipoUsuarioId: null,
          tipoUsuarioNombre: null,
          nombre: 'Priscila',
          primerApellido: 'Tafolla',
          segundoApellido: 'Astorga',
          genero: 'Femenino',
          fechaNacimiento: '1986-03-10T08:00:00.629',
          email: 'priscilatafolla@gmail.com',
          numeroIdentificacion: null,
          imagen: null,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaPersona(persona: Persona): Observable<PersonasResponse> {
    return this.http
      .put<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Actualizar/${persona.id}`,
        {
          id: 'bd751a2f-0f94-4cee-bbc1-08dde64c1ab3',
          usuarioId: '7eaa93f9-04b4-40bb-87b7-07c4481b3f52',
          tipoUsuarioId: null,
          tipoUsuarioNombre: null,
          nombre: 'Priscila',
          primerApellido: 'Tafolla',
          segundoApellido: 'Astorga',
          genero: 'Femenino',
          fechaNacimiento: '1986-03-10T08:00:00.629',
          email: 'priscilatafolla@gmail.com',
          numeroIdentificacion: null,
          imagen: null,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaPersona(personaId: string): Observable<PersonasResponse> {
    return this.http
      .delete<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Eliminar/${personaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
