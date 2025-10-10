import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Clinica,
  ClinicasResponse,
} from '../interfaces/clinicas.interface';

@Injectable({ providedIn: 'root' })
export class ClinicasService {
  private http = inject(HttpClient);

  obtieneClinicas(): Observable<ClinicasResponse> {
    return this.http
      .get<ClinicasResponse>(`${AppConfig.APIREST_URL}/api/Clinica/listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneClinica(hotelId: number): Observable<ClinicasResponse> {
    return this.http
      .get<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Detalles/${hotelId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaClinica(clinicaLike: Partial<Clinica> ): Observable<ClinicasResponse> {
    return this.http
      .post<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Administracion/registrar`, clinicaLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaClinica(clinicaLike: Partial<Clinica>): Observable<ClinicasResponse> {
    return this.http
      .put<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Actualizar/${clinicaLike.id}`, clinicaLike
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaClinica(clinicaId: number): Observable<ClinicasResponse> {
    return this.http
      .delete<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Eliminar/${clinicaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
