export interface CatalogosResponse {
  response: Catalogo[];
  status:   boolean;
  message:  any[];
}

export interface Catalogo {
  id:          number;
  descripcion: string;
}
