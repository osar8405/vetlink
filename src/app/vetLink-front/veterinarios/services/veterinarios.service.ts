import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Veterinario,
  VeterinarioResponse,
  VeterinariosResponse,
} from '../interfaces/veterinarios.interface';

@Injectable({ providedIn: 'root' })
export class VeterinariosService {
  private http = inject(HttpClient);

  obtieneVeterinarios(): Observable<VeterinariosResponse> {
    return this.http
      .get<VeterinariosResponse>(
        `${AppConfig.APIREST_URL}/api/Veterinario/listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneVeterinario(veterinarioId: number): Observable<VeterinarioResponse> {
    return this.http
      .get<VeterinarioResponse>(
        `${AppConfig.APIREST_URL}/api/Veterinario/Detalles/${veterinarioId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoVeterinario(
    tipoUsuarioLike: Partial<Veterinario>
  ): Observable<VeterinariosResponse> {
    return this.http
      .post<VeterinariosResponse>(
        `${AppConfig.APIREST_URL}/api/Veterinario/Nuevo`,
        tipoUsuarioLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaVeterinario(
    veterinario: Partial<Veterinario>
  ): Observable<VeterinariosResponse> {
    return this.http
      .put<VeterinariosResponse>(
        `${AppConfig.APIREST_URL}/api/Veterinario/Editar/${veterinario.id}`,
        veterinario
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaVeterinario(veterinarioId: number): Observable<VeterinariosResponse> {
    return this.http
      .delete<VeterinariosResponse>(
        `${AppConfig.APIREST_URL}/api/Veterinario/Eliminar/${veterinarioId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
