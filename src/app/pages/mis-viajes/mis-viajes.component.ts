import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
	selector: "app-mis-viajes",
	imports: [DatePipe],
	templateUrl: "./mis-viajes.component.html",
	styleUrl: "./mis-viajes.component.css",
})
export class MisViajesComponent {
	private usuariosService = inject(UsuariosService);
	private viajesService = inject(ViajesService);
	private router = inject(Router);
	token: string = localStorage.getItem("token") || "";

	viajesDelUsuario: Viaje[] = [];

	async ngOnInit() {
		try {
			const usuario = await this.usuariosService.getPerfilUsuario();
			const id = usuario.id_usuario;
			this.viajesDelUsuario = await this.viajesService.getViajesByUsuario(id);
		} catch (error) {
			console.log(error);
		}
	}

	irATrip(idViaje: number): void {
		this.router.navigate(["/viajes", idViaje]);
	}

	eliminarViaje(idViaje: number) {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción eliminará el viaje permanentemente. ¿Deseas continuar?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "No, cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await this.viajesService.removeViaje(idViaje, this.token);
					Swal.fire({
						title: "¡Viaje eliminado!",
						text: "El viaje ha sido eliminado con éxito.",
						icon: "success",
						toast: true,
						position: "top-end",
						timer: 3000,
						showConfirmButton: false,
						background: "#fefce8",
						color: "#713f12",
					});
					this.viajesDelUsuario = this.viajesDelUsuario.filter(
						(viaje) => viaje.id_viaje !== idViaje,
					);
				} catch (err) {
					Swal.fire({
						title: "¡Error!",
						text: "No se pudo eliminar el viaje.",
						icon: "error",
						toast: true,
						position: "top-end",
						timer: 3000,
						showConfirmButton: false,
						background: "#fef2f2",
						color: "#991b1b",
					});
				}
			}
		});
	}
}
