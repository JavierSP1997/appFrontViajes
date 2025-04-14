import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GuideComponent } from "../../components/guide/guide.component";
import { LastTripsComponent } from "../../components/last-trips/last-trips.component";
import { FeaturedTravelerComponent } from "../../components/featured-traveler/featured-traveler.component";

@Component({
	selector: "app-home",
	imports: [
		RouterLink,
		GuideComponent,
		LastTripsComponent,
		FeaturedTravelerComponent,
	],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
