import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { GuideComponent } from "../../components/guide/guide.component";
import { LastTripsComponent } from "../../components/last-trips/last-trips.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
	selector: "app-home",
	imports: [RouterLink, GuideComponent, LastTripsComponent, HeaderComponent],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
})
export class HomeComponent {}
