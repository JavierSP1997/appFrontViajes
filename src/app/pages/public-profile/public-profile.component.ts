import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario.interface";
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

	traductorDeGenero(gender: string): string {
		const genderMap: { [key: string]: string } = {
			male: "Masculino",
			female: "Femenino",
			other: "Otro",
		};
		return genderMap[gender];
	}

}