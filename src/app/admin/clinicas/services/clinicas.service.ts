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

  nuevaClinica(clinica: Clinica): Observable<ClinicasResponse> {
    return this.http
      .post<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Administracion/registrar`,
        {
          nombreClinica: 'string',
          telefono: 'string',
          sitioWeb: 'string',
          emailClinica: 'string',
          direccion: {
            calle: 'string',
            noInt: 'string',
            noExt: 'string',
            colonia: 'string',
            municipio: 'string',
            estado: 'string',
            cp: 'string',
          },
          nombre: 'string',
          primerApellido: 'string',
          segundoApellido: 'string',
          genero: 'string',
          fechaNacimiento: '2025-09-15T19:17:24.183Z',
          email: 'string',
          password: 'string',
          tipoUsuarioId: 0,
          cedulaProfesional: 'string',
          horarios: 'string',
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaClinica(clinica: Clinica): Observable<ClinicasResponse> {
    return this.http
      .put<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/Actualizar/${clinica.id}`,
        {
          nombreHotel: clinica.nombreHotel,
          telefono: clinica.telefono,
          direccion: clinica.direccion,
          latitud: clinica.latitud,
          longitud: clinica.longitud,
          imagen: clinica.url,
          eventoId: clinica.eventoId,
          detalles: clinica.detalles,
          convencionistasIds: clinica.convencionistasIds,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaClinica(clinicaId: number): Observable<ClinicasResponse> {
    return this.http
      .delete<ClinicasResponse>(
        `${AppConfig.APIREST_URL}/api/Clinica/${clinicaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
