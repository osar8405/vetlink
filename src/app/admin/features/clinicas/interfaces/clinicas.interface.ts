export interface ClinicasResponse {
  response: Clinica[];
  status:   boolean;
  message:  string[];
}

// export interface Clinica {
//   id:            number;
//   suscripcion:   null;
//   sucursales:    any[];
//   nombreClinica: string;
//   sitioWeb:      string | null;
//   logo:          string | null;
//   activo:        boolean;
//   suscripcionId: number;
// }


export interface ClinicaResponse {
  response: Clinica;
  status:   boolean;
  message:  any[];
}

export interface Clinica {
  id:            number;
  suscripcion:   null;
  sucursales:    Sucursal[];
  nombreClinica: string;
  sitioWeb:      string;
  logo:          string;
  url:           string;
  activo:        boolean;
  suscripcionId: number;
}

export interface Sucursal {
  id:             number;
  clinicaId:      number;
  nombreClinica:  string;
  direccion:      Direccion;
  nombreSucursal: string;
  telefono:       string;
  email:          string;
  fotoSucursal:   string;
  horario:        string;
  activo:         boolean;
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
