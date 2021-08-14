import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2/src/sweetalert2.js';

@Component({
  selector: 'app-restaurantes',
  templateUrl: './restaurantes.component.html',
  styleUrls: ['./restaurantes.component.css'],
})
export class RestaurantesComponent implements OnInit {
  ciudades: any[] = [];
  restaurantes: any[] = [];
  idx = 1;
  private url = 'http://opentable.herokuapp.com/api';
  private totalRestaurantes = 1;
  paginas = 1;
  ciudadElegida = 'Abilene';
  idRestaurante: number;
  fecha = new Date();
  cargando = false;
  br = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Please wait...',
    });
    Swal.showLoading();
    this.cargando = true;
    this.getCiudades(this.url);
    this.getRestaurantes(this.url);
    this.cargando = false;
  }

  ngOnInit(): void {}

  filtro(forma: NgForm) {
    this.getRestaurantes(this.url);
  }

  getCiudades(url: string) {
    this.http.get(`${url}/cities`).subscribe((ciudades: any) => {
      this.ciudades = Object.values(ciudades.cities);
      Swal.close();
    });
  }

  getRestaurantes(url: string) {
    this.http
      .get(
        `${url}/restaurants?city=${this.ciudadElegida}&per_page=25&page=${this.idx}`
      )
      .subscribe((rest: any) => {
        this.restaurantes = Object.values(rest.restaurants);
        this.totalRestaurantes = rest.total_entries;
        this.paginas = Math.trunc(this.totalRestaurantes / 25 + 1);

        if (this.restaurantes.length < 3) {
          this.br = true;
        } else {
          this.br = false;
        }
      });
  }

  paginaSiguiente() {
    if (this.paginas > this.idx) {
      this.idx++;
      this.getRestaurantes(this.url);
    } else {
      Swal.fire({
        allowOutsideClick: true,
        icon: 'info',
        text: 'Estas en la ultima página.',
      });
    }
  }

  paginaAnterior() {
    if (1 < this.idx) {
      this.idx--;
      this.getRestaurantes(this.url);
    } else {
      Swal.fire({
        allowOutsideClick: true,
        icon: 'info',
        text: 'Estas en la primera página.',
      });
    }
  }

  guardarRestaurante(id: number) {
    this.idRestaurante = id;
    this.router.navigate(['/restaurant', this.idRestaurante]);
  }
}
