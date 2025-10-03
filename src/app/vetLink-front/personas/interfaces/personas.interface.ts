export interface PersonasResponse {
  response: Persona[];
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
