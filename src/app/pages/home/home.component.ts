import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LastTripsComponent } from "../../components/last-trips/last-trips.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, LastTripsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
