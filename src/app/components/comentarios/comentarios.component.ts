import { Component, inject, Input } from "@angular/core";
import type { Comentario } from "../../../../interfaces/comentario";
import type { Usuario } from "../../../../interfaces/usuario.interface";
import { ComentariosService } from "../../services/comentarios.service";
import { UsuariosService } from "../../services/usuarios.service";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-comentarios",
	imports: [],
	templateUrl: "./comentarios.component.html",
	styleUrl: "./comentarios.component.css",
})
export class ComentariosComponent {
	@Input() viajeId!: number;

	private route = inject(ActivatedRoute);

	comentarios: Comentario[] = [];
	nuevoComentario = "";
	usuario: Usuario | null = null;

	private comentariosService = inject(ComentariosService);
	private usuariosService = inject(UsuariosService);

	async ngOnInit() {
		await this.obtenerUsuario();
		await this.obtenerComentarios();
	}

	async obtenerUsuario() {
		try {
			this.usuario = await this.usuariosService.getPerfilUsuario();
		} catch (error) {
			console.error("Error al obtener usuario:", error);
		}
	}

	async obtenerComentarios() {
		try {
			this.comentarios = await this.comentariosService.obtenerComentarios(
				this.viajeId,
			);
		} catch (error) {
			console.error("Error al obtener comentarios");
		}
	}

	async enviarComentario() {
		if (!this.nuevoComentario.trim() || !this.usuario) return;

		const body = {
			usuarios_id_usuario: this.usuario.id,
			viajes_id_viaje: this.viajeId,
			comentario: this.nuevoComentario.trim(),
		};

		try {
			await this.comentariosService.crearComentario(this.viajeId, body);
			this.nuevoComentario = "";
			await this.obtenerComentarios();
		} catch (error) {
			console.error("Error al enviar comentario:", error);
		}
	}
}
