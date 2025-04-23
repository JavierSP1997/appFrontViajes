import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario.interface";

@Component({
	selector: "app-header",
	imports: [RouterLink],
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
})
export class HeaderComponent {
	token = localStorage.getItem("token");

	usuariosService = inject(UsuariosService);
	usuario: Usuario | null = null;

	async ngOnInit() {
		if (this.token) {
			this.usuario = await this.usuariosService.getPerfilUsuario();
		}
	}
}
