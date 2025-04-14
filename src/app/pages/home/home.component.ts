import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GuideComponent } from "../../conponents/guide/guide.component";
import { LastTripsComponent } from '../../components/last-trips/last-trips.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, GuideComponent, LastTripsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
}
