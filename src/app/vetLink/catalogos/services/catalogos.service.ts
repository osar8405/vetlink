import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import { CatalogosResponse, Catalogo } from '../interfaces/catalogos.iterface';

@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private http = inject(HttpClient);

  obtieneElementos(nombreCatalogo: string): Observable<CatalogosResponse> {
    return this.http
      .get<CatalogosResponse>(
        `${AppConfig.APIREST_URL}api/Catalogos/${nombreCatalogo}/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneElemento(
    nombreCatalogo: string,
    catalogoId: number
  ): Observable<CatalogosResponse> {
    return this.http
      .get<CatalogosResponse>(
        `${AppConfig.APIREST_URL}api/Catalogos/${nombreCatalogo}/Detalles/${catalogoId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoElemento(
    nombreCatalogo: string,
    catalogo: Catalogo
  ): Observable<CatalogosResponse> {
    return this.http
      .post<CatalogosResponse>(
        `${AppConfig.APIREST_URL}/api/Catalogos/${nombreCatalogo}/Nuevo`,
        {
          descripcion: catalogo.descripcion,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaElemento(
    nombreCatalogo: string,
    catalogo: Catalogo
  ): Observable<CatalogosResponse> {
    return this.http
      .put<CatalogosResponse>(
        `${AppConfig.APIREST_URL}api/Catalogos/${nombreCatalogo}/Edita/${catalogo.id}`,
        {
          descripcion: catalogo.descripcion,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaElemento(
    nombreCatalogo: string,
    catalogoId: number
  ): Observable<CatalogosResponse> {
    return this.http
      .delete<CatalogosResponse>(
        `${AppConfig.APIREST_URL}api/Catalogos/${nombreCatalogo}/Eliminar/${catalogoId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
