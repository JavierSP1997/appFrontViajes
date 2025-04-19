import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-hero",
	imports: [RouterLink],
	templateUrl: "./hero.component.html",
	styleUrl: "./hero.component.css",
})
export class HeroComponent {
	isLoggedIn = false;

	ngOnInit(): void {
		this.isLoggedIn = !localStorage.getItem("token");
	}
}
