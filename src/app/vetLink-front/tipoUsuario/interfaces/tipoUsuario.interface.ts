export interface TipoUsuariosResponse {
  response: TipoUsuario[];
  status:   boolean;
  message:  string[];
}

export interface TipoUsuarioResponse {
  response: TipoUsuario;
  status:   boolean;
  message:  string[];
}

export interface TipoUsuario {
  id:     number;
  nombre: string;
}
