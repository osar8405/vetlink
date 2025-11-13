import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Sucursal,
  SucursalesResponse,
  SucursalResponse,
} from '../interfaces/sucursales.interface';

@Injectable({ providedIn: 'root' })
export class SucursalesService {
  private http = inject(HttpClient);

  obtieneSucursales(idClinica: number): Observable<SucursalesResponse> {
    return this.http
      .get<SucursalesResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Sucursal/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneSucursalPorId(sucursalId: number): Observable<SucursalResponse> {
    return this.http
      .get<SucursalResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Sucursal/Detalles/${sucursalId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaSucursal(sucursalLike: Partial<Sucursal>): Observable<SucursalesResponse> {
    return this.http
      .post<SucursalesResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Sucursal/Nuevo`,
        sucursalLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaSucursal(
    sucursalLike: Partial<Sucursal>
  ): Observable<SucursalesResponse> {
    return this.http
      .put<SucursalesResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Sucursal/Actualizar/${sucursalLike.id}`,
        sucursalLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  // eliminaClinica(clinicaId: number): Observable<SucursalesResponse> {
  //   return this.http
  //     .delete<SucursalesResponse>(
  //       `${AppConfig.APIREST_URL}/api/Clinica/Eliminar/${clinicaId}`
  //     )
  //     .pipe(catchError(AppConfig.handleErrors));
  // }
}
