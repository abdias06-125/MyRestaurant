import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NgForm } from '@angular/forms';
import { ReservacionModel } from '../../models/reservacion.model';
import { AuthService } from '../../services/auth.service';
import { ReservacionesService } from '../../services/reservaciones.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AmazingTimePickerService } from 'amazing-time-picker';



@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
})
export class RestaurantComponent implements OnInit {
  private url = 'http://opentable.herokuapp.com/api';
  idRestaurante: any;
  restaurante: any[] = [];
  sitio: any[];
  deseaReservar = true;
  personas: number;
  fecha = new Date();
  reservacion = new ReservacionModel();
  mapa = false;
  hora = '12:00';

  time = { hour: 13, minute: 30 };
  meridian = true;

  //Google Map
  position = {
    lat: null,
    lng: null,
  };

  label = {
    color: 'red',
    text: null,
  };
  tittle = 'gmaps';



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private res: ReservacionesService,
    private atp: AmazingTimePickerService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.reservacion.idRestaurante = params['id'];
    });
    this.getRestaurante();
  }

  ngOnInit(): void {
    this.reservacion.idUsuario = localStorage.getItem('idUser');
  }

  info() {
    Swal.fire({
      text: 'The reservation hours are from 11:30 AM to 12:00 AM',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  open() {
    const amazingTimePicker = this.atp.open({
      time: this.hora,
      theme: 'dark',
      rangeTime: {
        start: '11:30',
        end: '24:00',
      },
      arrowStyle: {
        background: '#26b7d3',
        color: 'white',
      },
    });

    amazingTimePicker.afterClose().subscribe((time) => {
      this.hora = time;
      this.reservacion.hora = time;

      console.log(this.reservacion.hora);
    });
  }

  getRestaurante() {
    this.http
      .get(`${this.url}/restaurants/${this.reservacion.idRestaurante}`)
      .subscribe((rest) => {
        this.restaurante = Object.values(rest);
        this.position.lat = rest['lat'];
        this.position.lng = rest['lng'];
        this.label.text = rest['name'];
        console.log(rest);
      });
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  btnReservar() {
    this.mapa = false;

    if (this.deseaReservar) {
      this.deseaReservar = false;
    } else {
      this.deseaReservar = true;
    }
  }

  reservar(form: NgForm) {
    if (form.invalid) {
      console.log('Formulario no valido');
      return;
    }

    this.reservacion.fotoRestaurante = this.restaurante[14];
    this.reservacion.nombreRestaurante = this.restaurante[1];
    this.reservacion.priceRestaurante = this.restaurante[11];
    this.reservacion.lat = this.restaurante[9];
    this.reservacion.lng = this.restaurante[10];
    console.log(this.reservacion);

    Swal.fire({
      title: 'Please Wait',
      text: 'We are saving the information',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    peticion = this.res.crearReservacion(this.reservacion);

    peticion.subscribe((resp) => {
      if (this.reservacion.personas > 1) {
        Swal.fire({
          title: `Table for ${this.reservacion.personas} people`,
          text: `Has been reserved at ${this.restaurante[1]}`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: `Table for ${this.reservacion.personas} person`,
          text: `Has been reserved at ${this.restaurante[1]}`,
          icon: 'success',
        });
      }
      this.deseaReservar = true;
    });

    delay(1000);
    this.router.navigate(['/restaurantes']);
  }

  btnMap() {
    if (this.mapa) {
      this.mapa = false;
    } else {
      this.mapa = true;
    }
  }
}
