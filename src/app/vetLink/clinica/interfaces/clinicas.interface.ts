export interface ClinicasResponse {
  response: Clinica[];
  status:   boolean;
  message:  string[];
}

export interface Clinica {
  id:                 number;
  nombreHotel:        string;
  telefono:           string;
  direccion:          string;
  latitud:            string;
  longitud:           string;
  imagen:             string;
  eventoId:           number;
  nombreEvento:       string;
  url:                string;
  detalles:           string;
  convencionistasIds: number[];
}