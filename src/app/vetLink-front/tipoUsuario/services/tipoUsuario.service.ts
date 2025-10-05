import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  TipoUsuario,
  TipoUsuarioResponse,
} from '../interfaces/tipoUsuario.interface';

@Injectable({ providedIn: 'root' })
export class TipoUsuarioService {
  private http = inject(HttpClient);

  obtieneTipoUsuarios(): Observable<TipoUsuarioResponse> {
    return this.http
      .get<TipoUsuarioResponse>(
        `${AppConfig.APIREST_URL}/api/TipoUsuario/listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneTipoUsuario(tipoUsuarioId: number): Observable<TipoUsuarioResponse> {
    return this.http
      .get<TipoUsuarioResponse>(
        `${AppConfig.APIREST_URL}/api/TipoUsuario/Detalles/${tipoUsuarioId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoTipoUsuario(
    tipoUsuarioLike: Partial<TipoUsuario>
  ): Observable<TipoUsuarioResponse> {
    return this.http
      .post<TipoUsuarioResponse>(
        `${AppConfig.APIREST_URL}/api/TipoUsuario/Nuevo`,
        tipoUsuarioLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaTipoUsuario(
    tipoUsuario: Partial<TipoUsuario>
  ): Observable<TipoUsuarioResponse> {
    return this.http
      .put<TipoUsuarioResponse>(
        `${AppConfig.APIREST_URL}/api/TipoUsuario/Editar/${tipoUsuario.id}`,
        tipoUsuario
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaTipoUsuario(tipoUsuarioId: number): Observable<TipoUsuarioResponse> {
    return this.http
      .delete<TipoUsuarioResponse>(
        `${AppConfig.APIREST_URL}/api/TipoUsuario/Eliminar/${tipoUsuarioId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
