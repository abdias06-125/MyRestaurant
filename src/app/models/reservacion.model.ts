export class ReservacionModel {
  id: string;
  idUsuario: string;
  idRestaurante: number;
  nombreRestaurante: string;
  priceRestaurante: number;
  fotoRestaurante: string;
  lat: string;
  lng: string;
  fecha: Date;
  hora: string;
  personas: number;
}
