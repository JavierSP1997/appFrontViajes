import { Component, inject } from "@angular/core";
import type { Usuario } from "../../../../interfaces/usuario.interface";
import { UsuariosService } from "../../services/usuarios.service";

@Component({
	selector: "app-travelers",
	imports: [],
	templateUrl: "./travelers.component.html",
	styleUrl: "./travelers.component.css",
})
export class TravelersComponent {
	usuariosService = inject(UsuariosService);
	arrUsers: Usuario[] = [];

	async ngOnInit() {
		this.arrUsers = await this.usuariosService.getAll();
	}
}
