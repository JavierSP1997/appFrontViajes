import {
	Component,
	EventEmitter,
	inject,
	Output,
	type OnInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms"; 
import { CommonModule } from "@angular/common"; 
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ciudades } from "../../data/ciudades.data";


@Component({
	selector: "app-finder",
	standalone: true, 
	imports: [CommonModule, FormsModule], 
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

	ciudades: string[] = ciudades;
	
	ciudadesFiltradas: string[] = [];
	
	ngOnInit(): void {
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

			this.router.navigate(["/viajes"], { queryParams: params });
		} else {
	
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: params,
				queryParamsHandling: "merge", 
			});
		}
	}

	filtrarCiudades() {
		const input = this.destino.toLowerCase().trim();
	
		if (input === '') {
		this.ciudadesFiltradas = [];
		return;
		}
	
		this.ciudadesFiltradas = this.ciudades.filter(ciudad =>
		ciudad.toLowerCase().includes(input)
		);
	}
	
	
	seleccionarCiudad(ciudad: string) {
		this.destino = ciudad;
		this.ciudadesFiltradas = [];
	}
}
