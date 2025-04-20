import { Component, Input, type OnInit, inject } from "@angular/core";
import type { Review } from "../../../../interfaces/review.interface";
import { FormsModule } from "@angular/forms";
import { ReviewService } from "../../services/review.service";
import { UsuariosService } from "../../services/usuarios.service";
import { DatePipe } from "@angular/common";

@Component({
	selector: "app-review",
	imports: [FormsModule, DatePipe],
	templateUrl: "./review.component.html",
	styleUrls: ["./review.component.css"],
})
export class ReviewsComponent implements OnInit {
	@Input() viajeId!: number;

	reviews: Review[] = [];
	nuevaReview = "";
	puntuacion = 5;
	mostrarResenas = false;
	private reviewService = inject(ReviewService);
	private usuariosService = inject(UsuariosService);
	token: string = localStorage.getItem("token") || "";
	usuarioId: number | null = null;

	async ngOnInit() {
		if (this.viajeId) {
			const usuario = await this.usuariosService.getPerfilUsuario();
			this.usuarioId = usuario.id_usuario;
			console.log("🧑‍💻 ID del usuario logueado:", this.usuarioId);
			await this.cargarReviews();
		}
	}

	async cargarReviews() {
		try {
			const reviews = await this.reviewService.getByViajeId(this.viajeId);
			console.log("📦 Reviews cargadas:", reviews);
			this.reviews = reviews.sort(
				(a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
			);
		} catch (error) {
			console.error("Error cargando las reseñas", error);
		}
	}

	async enviarReview() {
		if (!this.nuevaReview.trim()) return;

		try {
			if (this.usuarioId) {
				await this.reviewService.createReview({
					usuarios_id_usuario: this.usuarioId,
					viajes_id_viaje: this.viajeId,
					puntuacion: this.puntuacion,
					review: this.nuevaReview,
					fecha: new Date().toISOString().split("T")[0],
					id_review: 0,
					nombre_usuario: "",
				});
				this.nuevaReview = "";
				await this.cargarReviews();
			}
		} catch (error) {
			console.error("Error al enviar la reseña", error);
		}
	}

	async eliminarReview(id: number) {
		try {
			const review = this.reviews.find((r) => r.id_review === id);
			if (review && review.usuarios_id_usuario === this.usuarioId) {
				await this.reviewService.deleteReview(id);
				await this.cargarReviews();
			} else {
				console.error("No tienes permiso para eliminar esta reseña");
			}
		} catch (error) {
			console.error("Error al eliminar la reseña", error);
		}
	}
}
