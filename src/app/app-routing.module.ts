import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RestaurantesComponent } from './pages/restaurantes/restaurantes.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantComponent } from './pages/restaurant/restaurant.component';
import { ReservacionesComponent } from './pages/reservaciones/reservaciones.component';
import { DetalleComponent } from './pages/detalle/detalle.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'restaurantes',
    component: RestaurantesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'restaurant/:id',
    component: RestaurantComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reservaciones',
    component: ReservacionesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detalle/:id',
    component: DetalleComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
