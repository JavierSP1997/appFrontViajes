import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

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
}
