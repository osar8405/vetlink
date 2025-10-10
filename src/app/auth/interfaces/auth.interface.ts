// export interface LoginResp {
//   token: string /* …otros campos si hay*/;
// }
// export interface RenewResp {
//   token: string;
// }
// export interface Login {
//   response: Token;
//   status: boolean;
//   message: string[];
// }

// export interface Token {
//   token: string;
//   expiracion: Date;
// }


export interface Login {
  response: Token;
  status:   boolean;
  message:  string[];
}

export interface Token {
  token:   Token;
  usuario: Usuario;
}

export interface Token {
  result:                  string;
  id:                      number;
  exception:               null;
  status:                  number;
  isCanceled:              boolean;
  isCompleted:             boolean;
  isCompletedSuccessfully: boolean;
  creationOptions:         number;
  asyncState:              null;
  isFaulted:               boolean;
}

export interface Usuario {
  id:                   string;
  tipoUsuarioId:        null;
  tipoUsuarioNombre:    null;
  direccionDTO:         null;
  nombre:               string;
  primerApellido:       string;
  segundoApellido:      string;
  genero:               string;
  fechaNacimiento:      Date;
  email:                string;
  numeroIdentificacion: null;
  imagen:               null;
}
