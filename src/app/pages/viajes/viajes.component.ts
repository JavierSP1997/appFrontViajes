import { Component, inject, type OnInit, type OnDestroy } from "@angular/core";
import { ViajesService } from "../../services/viajes.service";
import { Router, ActivatedRoute } from "@angular/router";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { FinderComponent } from "../../components/finder/finder.component";
import type { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-viajes",
	imports: [FinderComponent, DatePipe],
	templateUrl: "./viajes.component.html",
	styleUrls: ["./viajes.component.css"],
})
export class ViajesComponent implements OnInit, OnDestroy {
	arrViajes: Viaje[] = [];
	viajeSeleccionado: Viaje | null = null;
	private queryParamsSubscription: Subscription | null = null;

	viajesService = inject(ViajesService);
	router = inject(Router);
	route = inject(ActivatedRoute);

	ngOnInit(): void {
		// Suscribimos a los query params para poder reaccionar a los cambios
		this.queryParamsSubscription = this.route.queryParams.subscribe(
			(queryParams) => {
				this.obtenerViajesFiltrados(queryParams);
			},
		);
		// Llamamos a la función inicialmente para cargar los viajes al principio
		this.obtenerViajesFiltrados(this.route.snapshot.queryParams);
	}

	ngOnDestroy(): void {
		// Nos aseguramos de desuscribirnos para evitar fugas de memoria
		if (this.queryParamsSubscription) {
			this.queryParamsSubscription.unsubscribe();
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	obtenerViajesFiltrados(queryParams: any): void {
		this.viajesService.getAllViajes().subscribe((viajes: Viaje[]) => {
			let filtrados = [...viajes];

			// Aplicamos los filtros según los query params
			if (queryParams.nombre) {
				filtrados = filtrados.filter((v) =>
					v.localizacion
						.toLowerCase()
						.includes(queryParams.nombre.toLowerCase()),
				);
			}

			if (queryParams.fecha_inicio) {
				const inicio = new Date(queryParams.fecha_inicio);
				filtrados = filtrados.filter((v) => new Date(v.fecha_inicio) >= inicio);
			}

			if (queryParams.fecha_fin) {
				const fin = new Date(queryParams.fecha_fin);
				filtrados = filtrados.filter((v) => new Date(v.fecha_fin) <= fin);
			}

			if (queryParams.personas_minimas) {
				const min = Number.parseInt(queryParams.personas_minimas, 10);
				filtrados = filtrados.filter((v) => v.personas_minimas >= min);
			} // Verifica si existe un parámetro 'personas_minimas' en los query params.
			// Si existe, convierte su valor a un número entero y filtra los viajes para que solo se muestren mayor o igual al valor del parámetro.

			// Asignamos el array filtrado a arrViajes
			this.arrViajes = filtrados;
		});
	}

	irATrip(idViaje: number): void {
		this.router.navigate(["/viaje", idViaje]);
	}

	quitarFiltros() {
		this.router.navigate(["/viajes"]);
	}
}
