import { Component, inject, type OnInit, type OnDestroy } from "@angular/core";
import { ViajesService } from "../../services/viajes.service";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import type { Viaje } from "../../../../interfaces/viaje.interface";
type ViajeConEstado = Viaje & {
	esAnfitrion?: boolean;
	estaInscripto?: boolean;
};
import { FinderComponent } from "../../components/finder/finder.component";
import type { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario.interface";

@Component({
	selector: "app-viajes",
	imports: [FinderComponent, DatePipe, RouterModule],
	templateUrl: "./viajes.component.html",
	styleUrls: ["./viajes.component.css"],
})
export class ViajesComponent implements OnInit, OnDestroy {
	viajesService = inject(ViajesService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	usuariosService = inject(UsuariosService);
	usuario: Usuario | null = null;
	arrViajes: ViajeConEstado[] = [];
	viajeSeleccionado: Viaje | null = null;
	queryParamsSubscription: Subscription | null = null;
	token = localStorage.getItem("token");

	async ngOnInit(): Promise<void> {
		if (this.token) {
			this.usuario = await this.usuariosService.getPerfilUsuario();
		}

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

	// Código actualizado dentro de la función obtenerViajesFiltrados
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	obtenerViajesFiltrados(queryParams: any): void {
		this.viajesService.getAllViajes().then((viajes: Viaje[]) => {
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
			}

			// Asignamos las propiedades esAnfitrion y estaInscripto
			if (this.usuario) {
				const idUsuario = this.usuario?.id_usuario; // ID del usuario logueado

				// Añadimos la lógica para cada viaje
				this.arrViajes = filtrados.map((viaje) => {
					// Verificamos si el usuario es el anfitrión del viaje
					const esAnfitrion = viaje.usuarios_id_usuario === idUsuario;

					// Retornamos el viaje con las propiedades adicionales
					return {
						...viaje,
						esAnfitrion,
					};
				});
			} else {
				// Si no hay usuario, no agregamos las propiedades
				this.arrViajes = filtrados;
			}
		});
	}

	irATrip(idViaje: number): void {
		this.router.navigate(["/viajes", idViaje]);
	}

	quitarFiltros() {
		this.router.navigate(["/viajes"]);
	}
}
