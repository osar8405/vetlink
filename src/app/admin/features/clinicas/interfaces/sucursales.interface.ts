export interface SucursalResponse {
  response: Sucursal;
  status:   boolean;
  message:  string[];
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


export interface SucursalesResponse {
  response: Sucursal[];
  status: boolean;
  message: any[];
}

export interface Response {
  id:             number;
  nombreSucursal: string;
  telefono:       string;
  email:          string;
  activo:         boolean;
  nombreClinica:  string;
}
