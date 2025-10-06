export interface ApiResponse<T> {
  response: T;
  status:   boolean;
  message:  string[];
}

export interface Persona {
  id:                   string;
  usuarioId:            string;
  tipoUsuarioId:        null;
  tipoUsuarioNombre:    null;
  nombre:               string;
  primerApellido:       string;
  segundoApellido:      string;
  genero:               string;
  fechaNacimiento:      string;
  email:                string;
  numeroIdentificacion: null;
  imagen:               null;
}

export type PersonasResponse = ApiResponse<Persona[]>;
export type PersonaResponse = ApiResponse<Persona>;
