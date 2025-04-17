import { Component, Input, inject, type OnInit } from "@angular/core";
import type { Comentario } from "../../../../interfaces/comentario.interface";
import { ComentariosService } from "../../services/comentarios.service";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-comentarios",
	imports: [DatePipe, FormsModule],
	templateUrl: "./comentarios.component.html",
	styleUrls: ["./comentarios.component.css"],
})
export class ComentariosComponent implements OnInit {
	@Input() viajeId!: number;

	private comentariosService = inject(ComentariosService);
	comentarios: Comentario[] = [];
	nuevoComentario = "";
	token: string = localStorage.getItem("token") || "";

	async ngOnInit() {
		if (this.viajeId) {
			await this.cargarComentarios();
		} else {
			console.error("No se recibió viajeId");
		}
	}

	async cargarComentarios() {
		try {
			const comentarios = await this.comentariosService.obtenerComentarios(
				this.viajeId,
			);
			this.comentarios = comentarios.sort(
				(a, b) =>
					new Date(a.fecha_comentario).getTime() -
					new Date(b.fecha_comentario).getTime(),
			);
		} catch (error) {
			console.error("Error cargando comentarios", error);
		}
	}

	async enviarComentario() {
		if (!this.nuevoComentario.trim()) return;

		try {
			await this.comentariosService.agregarComentario(
				this.viajeId,
				this.nuevoComentario,
				this.token,
			);
			this.nuevoComentario = "";
			await this.cargarComentarios();
		} catch (error) {
			console.error("Error al enviar comentario", error);
		}
	}
}
