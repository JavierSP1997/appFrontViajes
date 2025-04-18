import { Component } from "@angular/core";
import { GuideComponent } from "../../components/guide/guide.component";
import { LastTripsComponent } from "../../components/last-trips/last-trips.component";
import { FinderComponent } from "../../components/finder/finder.component";
import { HeroComponent } from "../../components/hero/hero.component";
// import { FeaturedTravelerComponent } from '../../components/featured-traveler/featured-traveler.component';

@Component({
	selector: "app-home",
	imports: [GuideComponent, LastTripsComponent, FinderComponent, HeroComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
