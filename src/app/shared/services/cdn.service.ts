import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../app-config';
import { catchError, Observable } from 'rxjs';
import type { CDNResponse } from '../interfaces/cdn.interface';

@Injectable({ providedIn: 'root' })
export class CdnService {
  http = inject(HttpClient);

  uploadFile(
    modulo: string,
    nombreArchivo: string,
    file: File
  ): Observable<CDNResponse> {
    console.log('mi file: ', file);
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('modulo', modulo);
    formData.append('nombreArchivo', nombreArchivo);
    return this.http
      .post<CDNResponse>(
        `${AppConfig.APIREST_URL}/api/archivos/subir`,
        formData
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
