import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Persona,
  PersonasResponse,
  PersonaResponse,
} from '../interfaces/personas.interface';

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private http = inject(HttpClient);

  obtienePersonas(): Observable<PersonasResponse> {
    return this.http
      .get<PersonasResponse>(`${AppConfig.APIREST_URL}/api/Persona/Listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtienePersona(personaId: number): Observable<PersonaResponse> {
    return this.http
      .get<PersonaResponse>(
        `${AppConfig.APIREST_URL}api/Persona/Detalles/${personaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaPersona(persona: Partial<Persona>): Observable<PersonasResponse> {
    return this.http
      .post<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Persona/Nuevo`, persona
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaPersona(persona: Partial<Persona>): Observable<PersonasResponse> {
    return this.http
      .put<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Persona/Actualizar/${persona.id}`, persona
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaPersona(personaId: string): Observable<PersonasResponse> {
    return this.http
      .delete<PersonasResponse>(
        `${AppConfig.APIREST_URL}/api/Persona/Eliminar/${personaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
