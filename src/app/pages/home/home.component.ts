import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
<<<<<<< HEAD
import { GuideComponent } from "../../components/guide/guide.component";
import { LastTripsComponent } from '../../components/last-trips/last-trips.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, GuideComponent, LastTripsComponent],
=======
import { FinderComponent } from '../../components/finder/finder.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FinderComponent],
>>>>>>> feature-finder
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
