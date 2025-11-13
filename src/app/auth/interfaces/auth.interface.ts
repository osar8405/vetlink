export interface LoginResp {
  token: string /* …otros campos si hay*/;
}
export interface RenewResp {
  token: string;
}
export interface Login {
  response: Token;
  status: boolean;
  message: string[];
}

export interface Token {
  token: string;
  expiracion: Date;
}

export interface ForgotPassword {
  status:   boolean;
  message:  string[];
  response: string;
}
