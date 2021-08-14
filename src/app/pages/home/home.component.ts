import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  public slides = [
    { src: "/assets/img/Bleach.jpg" },
    { src: "/assets/img/anime table.jpg" },
    { src: "/assets/img/onepiece.png" },
    { src: "/assets/img/Black_Bull_blind_date.png" }
  ];

  currentSlide = 0;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}


}
