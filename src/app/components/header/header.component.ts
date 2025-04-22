import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NotificacionesComponent } from "../notificaciones/notificaciones.component";

@Component({
	selector: "app-header",
	imports: [RouterLink, NotificacionesComponent],
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
})
export class HeaderComponent {
	isLoggedIn = false;

	ngOnInit(): void {
	  this.isLoggedIn = !!localStorage.getItem("token"); 
	}
}
