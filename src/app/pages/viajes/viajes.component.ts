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
	arrViajes: Viaje[] = [
		{
			id_viaje: 1,
			id_usuario: 101,
			nombre_viaje: "Aventura en los Alpes",
			fecha_inicio: new Date("2023-12-01"),
			fecha_fin: new Date("2023-12-10"),
			coste_por_persona: 1200,
			personas_minimas: 5,
			localizacion: "Alpes, Suiza",
			itinerario: "Excursiones, esquí y visitas guiadas",
			imagen: "",
		},
		{
			id_viaje: 2,
			id_usuario: 102,
			nombre_viaje: "Safari en Kenia",
			fecha_inicio: new Date("2024-01-15"),
			fecha_fin: new Date("2024-01-25"),
			coste_por_persona: 2500,
			personas_minimas: 8,
			localizacion: "Nairobi, Kenia",
			itinerario: "Safari, visitas a reservas naturales y cultura local",
			imagen: "",
		},
		{
			id_viaje: 3,
			id_usuario: 103,
			nombre_viaje: "Descubre Japón",
			fecha_inicio: new Date("2024-03-10"),
			fecha_fin: new Date("2024-03-20"),
			coste_por_persona: 3000,
			personas_minimas: 10,
			localizacion: "Tokio, Japón",
			itinerario: "Templos, gastronomía y tecnología",
			imagen: "",
		},
		{
			id_viaje: 4,
			id_usuario: 104,
			nombre_viaje: "Relax en Maldivas",
			fecha_inicio: new Date("2024-05-01"),
			fecha_fin: new Date("2024-05-10"),
			coste_por_persona: 4000,
			personas_minimas: 2,
			localizacion: "Maldivas",
			itinerario: "Playas, snorkel y lujo",
			imagen: "",
		},
		{
			id_viaje: 5,
			id_usuario: 105,
			nombre_viaje: "Ruta por la Toscana",
			fecha_inicio: new Date("2024-06-15"),
			fecha_fin: new Date("2024-06-25"),
			coste_por_persona: 1800,
			personas_minimas: 4,
			localizacion: "Toscana, Italia",
			itinerario: "Viñedos, pueblos medievales y gastronomía",
			imagen: "",
		},
	];
	viajeSeleccionado: Viaje | null = null;

	viajesService = inject(ViajesService);
	router = inject(Router);
	route = inject(ActivatedRoute);

	async ngOnInit() {
		try {
			const viajes = await this.viajesService.getAllViajes();

			const { nombre, fecha_inicio, fecha_fin, personas_minimas } =
				this.route.snapshot.queryParams;

			let filtrados = [...viajes];

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

			this.arrViajes = filtrados;
		} catch (error) {
			console.error("Error al cargar viajes:", error);
			const viajes = await this.viajesService.getAllViajes();

			this.route.queryParams.subscribe((params) => {
				let filtrados = viajes;

				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				if (params["nombre"]) {
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					const nombre = params["nombre"].toLowerCase();
					filtrados = filtrados.filter((v) =>
						v.nombre_viaje.toLowerCase().includes(nombre),
					);
				}

				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				if (params["fecha_inicio"]) {
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					const fechaInicio = new Date(params["fecha_inicio"]);
					filtrados = filtrados.filter(
						(v) => new Date(v.fecha_inicio) >= fechaInicio,
					);
				}

				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				if (params["fecha_fin"]) {
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					const fechaFin = new Date(params["fecha_fin"]);
					filtrados = filtrados.filter(
						(v) => new Date(v.fecha_fin) <= fechaFin,
					);
				}

				// biome-ignore lint/complexity/useLiteralKeys: <explanation>
				if (params["personas_minimas"]) {
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					const personasMin = Number.parseInt(params["personas_minimas"], 10);
					filtrados = filtrados.filter(
						(v) => v.personas_minimas >= personasMin,
					);
				}

				this.arrViajes = filtrados;
			});
		}
	}

	actualizarTrips(viajes: Viaje[]) {
		this.arrViajes = viajes;
	}

	irATrip(idViaje: number) {
		this.router.navigate(["/viaje", idViaje]);
	}
}
