export interface MercadoProximo {
  id: number;
  nome: string;
  tipo: string;
  endereco?: string;
  latitude: number;
  longitude: number;
  distanciaKm: number;
  distanciaFormatada: string;
}
