export interface ClinicasResponse {
  response: Clinica[];
  status:   boolean;
  message:  string[];
}

export interface Clinica {
  id:            number;
  sucursales:    any[];
  nombreClinica: string;
  sitioWeb:      null;
  logo:          string;
  activo:        boolean;
  suscripcionId: number;
}
