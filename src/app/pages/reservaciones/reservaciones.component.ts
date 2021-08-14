import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReservacionModel } from '../../models/reservacion.model';
import { ReservacionesService } from 'src/app/services/reservaciones.service';
import { browser } from 'protractor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css'],
})
export class ReservacionesComponent implements OnInit {
  private url = 'http://opentable.herokuapp.com/api';
  reservacion = new ReservacionModel();
  reservaciones: ReservacionModel[] = [];
  restaurante: any[] = [];
  br = false;

  idReservacion: string;
  idUsuario: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private res: ReservacionesService
  ) {}

  ngOnInit(): void {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Please wait...',
    });
    Swal.showLoading();

    this.reservacion.idUsuario = localStorage.getItem('idUser');
    this.idUsuario = localStorage.getItem('idUser');

    this.res.getReservaciones().subscribe((resp) => {
      this.reservaciones = resp;
      console.log(this.reservaciones);
      const reservacionesFiltrada = this.reservaciones.filter(
        (reserv) => reserv.idUsuario === this.idUsuario
      );
      this.reservaciones = reservacionesFiltrada;
      if (this.reservaciones.length < 3) {
        this.br = true;
      } else {
        this.br = false;
      }
      console.log('Reservaciones Filtradas');
      console.log(this.reservaciones);
      // console.log(this.reservaciones[0].idRestaurante);

      Swal.close();
    });
  }

  getRestaurante(id: any) {
    this.http.get(`${this.url}/restaurants/${id}`).subscribe((rest) => {
      this.restaurante = Object(rest);

      localStorage.setItem('lat', this.restaurante['lat']);
      localStorage.setItem('lng', this.restaurante['lng']);
      localStorage.setItem('nombreRestaurante', this.restaurante['name']);

      return this.restaurante;
    });
  }

  verDetalles(id: string, idRestaurante: string) {
    this.idReservacion = id;
    this.getRestaurante(idRestaurante);
    localStorage.setItem('idRestaurante', idRestaurante);

    this.router.navigate(['/detalle', this.idReservacion]);
  }

  borrar(reservacion: ReservacionModel, i: number) {
    Swal.fire({
      title: '¿Are you sure??',
      text: `Are you sure to delete the reservation for the restaurant ${reservacion.nombreRestaurante}?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        this.reservaciones.splice(i, 1);
        this.res.borrarReservacion(reservacion.id).subscribe();
      }
    });
  }
}
