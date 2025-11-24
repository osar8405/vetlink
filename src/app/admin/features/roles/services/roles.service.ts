import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type { RolesResponse, Rol } from '../interfaces/roles.interface';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);

  obtieneRoles(): Observable<RolesResponse> {
    return this.http
      .get<RolesResponse>(`${AppConfig.APIREST_URL}/api/Roles/listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneRol(hotelId: number): Observable<RolesResponse> {
    return this.http
      .get<RolesResponse>(
        `${AppConfig.APIREST_URL}api/Roles/Detalles/${hotelId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoRol(rolLike: Partial<Rol>): Observable<RolesResponse> {
    return this.http
      .post<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Administracion/registrar`, rolLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaRol(rolLike: Partial<Rol>): Observable<RolesResponse> {
    return this.http
      .put<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Roles/Actualizar/${rolLike.id}`, rolLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaRol(rolId: string): Observable<RolesResponse> {
    return this.http
      .delete<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Roles/${rolId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
