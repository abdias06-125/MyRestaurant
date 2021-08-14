import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservacionModel } from '../models/reservacion.model';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ReservacionesService {
  private url = 'https://login-app-d4c96.firebaseio.com/';

  constructor(private http: HttpClient, private database: AngularFireDatabase) {}

  crearReservacion(reservacion: ReservacionModel) {
    console.log(reservacion);
    return this.http.post(`${this.url}/reservaciones.json`, reservacion).pipe(
      map((resp: any) => {
        reservacion.id = resp.name;
        return reservacion;
      })
    );
  }

  borrarReservacion(id: string) {
    return this.http.delete(`${this.url}/reservaciones/${id}.json`);
  }
  
  getReservacion(id: string) {
    // return this.database.object<any>(`${this.url}/reservaciones/${id}`).valueChanges();
    return this.http.get(`${this.url}/reservaciones/${id}.json`);
  }

  getReservaciones() {
    return this.http
      .get(`${this.url}/reservaciones.json`)
      .pipe(map(this.crearArreglo));
  }
  
  private crearArreglo(resObj: object) {
    const reservas: ReservacionModel[] = [];

    if (resObj === null) {
      return [];
    }

    Object.keys(resObj).forEach((key) => {
      const reserva: ReservacionModel = resObj[key];
      reserva.id = key;

      reservas.push(reserva);
    });
    return reservas;
  }
}
