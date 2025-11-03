import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports:[RouterModule, RouterOutlet, 
          MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule
           ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  currentSlide = 0;

  featuredItems = [
    { name: "Fauteuil Design Modern", price: "299€", image: "/assets/placeholder-600x400.png" },
    { name: "Table Basse Scandinave", price: "199€", image: "/assets/placeholder-600x400.png" },
    { name: "Bureau Ergonomique Pro", price: "449€", image: "/assets/placeholder-600x400.png" }
  ];

  categories = ["Chaises", "Tables", "Bureaux", "Canapés", "Armoires", "Lits"];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.featuredItems.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.featuredItems.length) % this.featuredItems.length;
  }
}
