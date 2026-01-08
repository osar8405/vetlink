export interface ApiResponse<T> {
  response: T;
  status:   boolean;
  message:  string[];
}

export interface Persona {
  nombre:               string;
  primerApellido:       string;
  segundoApellido:      string;
  genero:               string;
  fechaNacimiento:      string;
  numeroIdentificacion: number;
  telefono:             string | null;
  imagen:               string;
  id:                   string;
  tipoUsuarioId:        number;
  tipoUsuarioNombre:    string;
  email:                string;
  url:                  string | null;
  direccion:            PersonaDireccion | null;
}
export interface PersonaDireccion {
  calle:     string | null;
  noInt:     string | null;
  noExt:     string | null;
  colonia:   string | null;
  municipio: string | null;
  estado:    string | null;
  cp:        string | null;
  id:        number | null;
}

export type PersonasResponse = ApiResponse<Persona[]>;
export type PersonaResponse = ApiResponse<Persona>;
