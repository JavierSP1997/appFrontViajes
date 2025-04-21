import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import Swal from "sweetalert2";

@Component({
	selector: "app-mis-viajes",
	imports: [],
	templateUrl: "./mis-viajes.component.html",
	styleUrl: "./mis-viajes.component.css",
})
export class MisViajesComponent {
	private usuariosService = inject(UsuariosService);
	private viajesService = inject(ViajesService);

	viajesDelUsuario: Viaje[] = [];

	async ngOnInit() {
		try {
			const usuario = await this.usuariosService.getPerfilUsuario();
			const idUsuario = usuario.id_usuario;
			this.viajesDelUsuario =
				await this.viajesService.getViajesUsuario(idUsuario);
		} catch (error) {
			console.log(error);
		}
	}
}
