import { Component, inject, type OnInit } from "@angular/core";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { FinderComponent } from "../../components/finder/finder.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-viajes",
	templateUrl: "./viajes.component.html",
	styleUrls: ["./viajes.component.css"],
	standalone: true,
	imports: [FinderComponent],
})
export class ViajesComponent implements OnInit {
	arrViajes: Viaje[] = [];
	viajeSeleccionado: Viaje | null = null;

	viajesService = inject(ViajesService);
	router = inject(Router);
	route = inject(ActivatedRoute);

	async ngOnInit() {
		try {
			const viajes = await this.viajesService.getAllViajes();

			this.arrViajes = viajes;

			// Obtenemos los query params
			const { nombre, fecha_inicio, fecha_fin, personas_minimas } =
				this.route.snapshot.queryParams;

			let filtrados = [...viajes];

			// Aplicamos los filtros según los query params
			if (nombre) {
				filtrados = filtrados.filter((v) =>
					v.nombre_viaje.toLowerCase().includes(nombre.toLowerCase()),
				);
			}

			if (fecha_inicio) {
				const inicio = new Date(fecha_inicio);
				filtrados = filtrados.filter((v) => new Date(v.fecha_inicio) >= inicio);
			}

			if (fecha_fin) {
				const fin = new Date(fecha_fin);
				filtrados = filtrados.filter((v) => new Date(v.fecha_fin) <= fin);
			}

			if (personas_minimas) {
				const min = Number.parseInt(personas_minimas, 10);
				filtrados = filtrados.filter((v) => v.personas_minimas >= min);
			}

			// Asignamos el array filtrado a arrViajes
			this.arrViajes = filtrados;
		} catch (error) {
			console.error("Error al cargar viajes:", error);
		}
	}

	actualizarTrips(viajes: Viaje[]): void {
		this.arrViajes = viajes;
	}

	irATrip(idViaje: number): void {
		this.router.navigate(["/viaje", idViaje]);
	}
}
