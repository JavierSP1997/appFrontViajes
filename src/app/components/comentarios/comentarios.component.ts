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
	private comentariosService = inject(ComentariosService);
	token: string = localStorage.getItem("token") || "";

	async ngOnInit() {
		if (this.viajeId) {
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

	private scrollToBottom() {
		if (this.chatContainer) {
			const el = this.chatContainer.nativeElement;
			el.scrollTop = el.scrollHeight;
		}
	}
}
