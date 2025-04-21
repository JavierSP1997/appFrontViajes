import {
	Component,
	type ElementRef,
	Input,
	ViewChild,
	inject,
	type OnInit,
} from "@angular/core";
import type { Comentario } from "../../../../interfaces/comentario.interface";
import { ComentariosService } from "../../services/comentarios.service";
import { UsuariosService } from "../../services/usuarios.service";
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
	@ViewChild("chatContainer") chatContainer!: ElementRef;

	comentarios: Comentario[] = [];
	nuevoComentario = "";
	comentarioEditado = "";
	comentarioEditandoId: number | null = null;

	private comentariosService = inject(ComentariosService);
	private usuariosService = inject(UsuariosService);

	token: string = localStorage.getItem("token") || "";
	usuarioId: number | null = null;

	async ngOnInit() {
		if (this.viajeId) {
			const usuario = await this.usuariosService.getPerfilUsuario();
			this.usuarioId = usuario.id_usuario;
			await this.cargarComentarios();
			this.scrollToBottom();
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
			setTimeout(() => this.scrollToBottom(), 0);
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

	activarEdicion(comentario: Comentario) {
		this.comentarioEditandoId = comentario.id_comentario;
		this.comentarioEditado = comentario.comentario;
	}

	async editarComentario(idComentario: number) {
		if (!this.comentarioEditado.trim()) return;

		try {
			await this.comentariosService.editarComentario(
				this.viajeId,
				idComentario,
				this.comentarioEditado,
				this.token,
			);
			this.comentarioEditandoId = null;
			this.comentarioEditado = "";
			await this.cargarComentarios();
		} catch (error) {
			console.error("Error al editar comentario", error);
		}
	}

	async eliminarComentario(idComentario: number) {
		try {
			await this.comentariosService.eliminarComentario(
				this.viajeId,
				idComentario,
				this.token,
			);
			await this.cargarComentarios();
		} catch (error) {
			console.error("Error al eliminar comentario", error);
		}
	}

	private scrollToBottom() {
		if (this.chatContainer) {
			const el = this.chatContainer.nativeElement;
			el.scrollTop = el.scrollHeight;
		}
	}
}
