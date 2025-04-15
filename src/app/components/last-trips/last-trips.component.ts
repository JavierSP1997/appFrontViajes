import { Component, inject } from "@angular/core";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ViajesService } from "../../services/viajes.service";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
	selector: "app-last-trips",
	imports: [DatePipe, RouterLink],
	templateUrl: "./last-trips.component.html",
	styleUrl: "./last-trips.component.css",
})
export class LastTripsComponent {
	viajes: Viaje[] | undefined = [];
	private viajeService = inject(ViajesService);

	ngOnInit() {
		try {
			this.viajeService.getLastViaje().subscribe((viajes: Viaje[]) => {
				this.viajes = viajes.reverse().slice(0, 3);
			});
		} catch (error) {
			console.log("error al cargar los viajes", error);
		}
	}
}
