export interface ClinicasResponse {
  response: Clinica[];
  status:   boolean;
  message:  any[];
}

export interface Clinica {
  id:            number;
  nombreClinica: string;
  email:         string;
  telefono:      string;
  activo:        boolean;
  suscripcionId: number;
  direccion:     Direccion;
}

export interface Direccion {
  calle:     string;
  noInt:     string;
  noExt:     string;
  colonia:   string;
  municipio: string;
  estado:    string;
  cp:        string;
}
