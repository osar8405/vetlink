export interface VeterinariosResponse {
  response: Veterinario[];
  status:   boolean;
  message:  any[];
}

export interface VeterinarioResponse {
  response: Veterinario;
  status:   boolean;
  message:  any[];
}

export interface Veterinario {
  id: number
}
