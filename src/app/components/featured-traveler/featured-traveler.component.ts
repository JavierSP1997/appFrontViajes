import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario";

@Component({
	selector: "app-featured-traveler",
	imports: [],
	templateUrl: "./featured-traveler.component.html",
	styleUrl: "./featured-traveler.component.css",
})
export class FeaturedTravelerComponent {
	usuariosService = inject(UsuariosService);
	arrUsers: Usuario[] = [];

	async ngOnInit() {
		this.arrUsers = await this.usuariosService.getAll();
	}
}
