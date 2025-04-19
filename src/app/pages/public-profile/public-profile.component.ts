import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { Usuario } from "../../../../interfaces/usuario.interface";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-public-profile",
	imports: [],
	templateUrl: "./public-profile.component.html",
	styleUrl: "./public-profile.component.css",
})
export class PublicProfileComponent {
	usuariosService = inject(UsuariosService);
	private route = inject(ActivatedRoute);
	usuario: Usuario | null = null;
	usuarioId: number | null = null;
  usuarioJSONstring = '';

	async ngOnInit() {
		const paramId = this.route.snapshot.paramMap.get("id");
		this.usuarioId = paramId ? Number(paramId) : null;

		if (this.usuarioId !== null) {
			this.usuario = await this.usuariosService.getById(this.usuarioId);
      this.usuarioJSONstring = JSON.stringify(this.usuario)

		}
	}
}