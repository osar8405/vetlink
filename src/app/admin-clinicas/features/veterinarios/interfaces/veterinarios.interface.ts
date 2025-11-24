export interface ApiResponse<T> {
  response: T;
  status:   boolean;
  message:  string[];
}

export interface Veterinario {
  id:                string;
  nombreCompleto:    string;
  sucursales:        string[];
  clinicas:          string[];
  cedulaProfesional: string;
  horarios:          string;
}

export type VeterinariosResponse = ApiResponse<Veterinario[]>;

export interface VeterinarioResponse {
  response: Response;
  status:   boolean;
  message:  string[];
}

export interface Response {
  id:                string;
  persona:           Persona;
  clinicas:          any[];
  cedulaProfesional: string;
  horarios:          string;
}

export interface Persona {
  id:                   string;
  tipoUsuarioId:        number;
  tipoUsuarioNombre:    null;
  direccionDTO:         null;
  nombre:               string;
  primerApellido:       string;
  segundoApellido:      string;
  genero:               string;
  fechaNacimiento:      Date;
  email:                null;
  numeroIdentificacion: number;
  imagen:               string;
}



