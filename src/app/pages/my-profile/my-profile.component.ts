import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario.interface";
// biome-ignore lint/style/useImportType: <explanation>
import { Router, RouterLink } from "@angular/router";

@Component({
	selector: "app-my-profile",
	imports: [RouterLink],
	templateUrl: "./my-profile.component.html",
	styleUrl: "./my-profile.component.css",
})
export class MyProfileComponent {
	constructor(private router: Router) {}

	usuariosService = inject(UsuariosService);
	usuario: Usuario | null = null;

	async ngOnInit() {
		this.usuario = await this.usuariosService.getPerfilUsuario();
	}

	editarPerfil() {
		if (this.usuario?.id_usuario) {
			this.router.navigate([
				`/perfil-usuario/${this.usuario.id_usuario}/editar`,
			]);
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

	get perfilIncompleto(): boolean {
		const u = this.usuario;
		return (
			!!u && (!u.gender || !u.hobbies?.length || !u.pets?.length || !u.imagen)
		);
	}
	cerrarSesion() {
		localStorage.removeItem("token");
		this.router.navigate(["/"]);
	}
}
