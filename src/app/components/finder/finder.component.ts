import {
	Component,
	EventEmitter,
	inject,
	Output,
	type OnInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms"; // Importa FormsModule
import { CommonModule } from "@angular/common"; // Importa CommonModule
import type { Viaje } from "../../../../interfaces/viaje.interface";

@Component({
	selector: "app-finder",
	standalone: true, // Módulo Standalone
	imports: [CommonModule, FormsModule], // Asegúrate de que FormsModule esté aquí
	templateUrl: "./finder.component.html",
	styleUrls: ["./finder.component.css"],
})
export class FinderComponent implements OnInit {
	@Output() viajesFiltrados = new EventEmitter<Viaje[]>();

	router = inject(Router);
	route = inject(ActivatedRoute);

	destino = "";
	fechaIda = "";
	fechaVuelta = "";
	viajeros = "";

	ngOnInit(): void {
		// Leemos los query params para preservar los datos cuando la página se recarga
		this.route.queryParams.subscribe(async (params) => {
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			this.destino = params["nombre"] || "";
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			this.fechaIda = params["fecha_inicio"] || "";
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			this.fechaVuelta = params["fecha_fin"] || "";
			// biome-ignore lint/complexity/useLiteralKeys: <explanation>
			this.viajeros = params["personas_minimas"] || "";
		});
	}

	// Emitimos los datos en la URL como queryParams
	async onSubmit(event: Event) {
		event.preventDefault();

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const params: any = {
			...(this.destino && { nombre: this.destino }),
			...(this.fechaIda && { fecha_inicio: this.fechaIda }),
			...(this.fechaVuelta && { fecha_fin: this.fechaVuelta }),
			...(this.viajeros && { personas_minimas: this.viajeros }),
		};

		if (!this.router.url.startsWith("/viajes")) {
			// Si estamos en home → redirige a /viajes con los parámetros en la URL
			this.router.navigate(["/viajes"], { queryParams: params });
		} else {
			// Si ya estamos en /viajes, solo modificamos los parámetros
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: params,
				queryParamsHandling: "merge", // Mantenemos los parámetros existentes y solo agregamos los nuevos
			});
		}
	}
}
