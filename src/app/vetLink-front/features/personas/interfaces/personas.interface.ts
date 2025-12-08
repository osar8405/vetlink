export interface ApiResponse<T> {
  response: T;
  status:   boolean;
  message:  string[];
}

export interface Persona {
  id:                   string;
  usuarioId:            string;
  tipoUsuarioId:        number;
  tipoUsuarioNombre:    string;
  nombre:               string;
  primerApellido:       string;
  segundoApellido:      string;
  genero:               string;
  fechaNacimiento:      string;
  email:                string;
  numeroIdentificacion: number;
  imagen:               string;
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
}

export type PersonasResponse = ApiResponse<Persona[]>;
export type PersonaResponse = ApiResponse<Persona>;
