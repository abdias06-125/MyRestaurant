import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservacionModel } from '../../models/reservacion.model';
import { ReservacionesService } from 'src/app/services/reservaciones.service';
import { HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import Swal from 'sweetalert2';
import { CommentStmt } from '@angular/compiler';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
})
export class DetalleComponent implements OnInit {
  private url = 'http://opentable.herokuapp.com/api';
  idRestaurante: string;
  idReservacion: string;
  reservacion: ReservacionModel;
  restaurante: [] = [];
  personas: any;
  fecha = new Date();
  mapa = false;
  actualizar = 0;

  marker = { lat: null, lng: null };
  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: string;
  // display?: google.maps.LatLngLiteral;

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
    private activatedRoute: ActivatedRoute,
    private res: ReservacionesService,
    private http: HttpClient,
    private router: Router
  ) {
    const x = '1';
    const y = Number(x);
  }

  ngOnInit(): void {
    this.cargar();
    // this.showMap();
    this.getRestaurante();
  }

  cargar(){
    this.idRestaurante = localStorage.getItem('idRestaurante');
    this.activatedRoute.params.subscribe((params) => {
      this.idReservacion = params['id'];
    });

    this.res
      .getReservacion(this.idReservacion)
      .subscribe((resp: ReservacionModel) => {
        this.reservacion = resp;
        this.personas = this.reservacion.personas;
        this.fecha = this.reservacion.fecha;

        // localStorage.setItem('lat', this.reservacion.lat);
        // localStorage.setItem('lng', this.reservacion.lng);
        // localStorage.setItem(
        //   'nombreRestaurante',
        //   this.reservacion.nombreRestaurante
        // );
      });

  }

  showMap() {
    this.position.lat = Number(localStorage.getItem('lat'));
    this.position.lng = Number(localStorage.getItem('lng'));
    this.label.text = localStorage.getItem('nombreRestaurante');
  }

  getRestaurante() {
    this.http
      .get(`${this.url}/restaurants/${this.idRestaurante}`)
      .subscribe((rest) => {
        this.restaurante = Object(rest);
        console.log(this.restaurante);
        this.position.lat = rest['lat'];
        this.position.lng = rest['lng'];
        this.label.text = rest['name'];
          // if (this.restaurante['name'] !== this.label.text) {
          //   window.location.reload();
          // }
      });
  }

  btnMap() {
    if (this.mapa) {
      this.mapa = false;
    } else {
      this.mapa = true;
    }
  }
  borrar() {
    Swal.fire({
      title: '¿Are you sure??',
      text: `Are you sure you want to delete the reservation for the restaurant ${this.reservacion.nombreRestaurante}?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        this.res.borrarReservacion(this.idReservacion).subscribe();
        this.router.navigate(['/restaurantes']);
      }
    });
  }

  limpiarStorage() {
    localStorage.setItem('lat', '');
    localStorage.setItem('lng', '');
    localStorage.setItem('nombreRestaurante', '');
  }
}
