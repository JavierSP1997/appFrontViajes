import {
	Component,
	Input,
	type OnInit,
	inject,
	ViewChildren,
	type QueryList,
	type ElementRef,
	ChangeDetectorRef,
} from "@angular/core";
import type { Review } from "../../../../interfaces/review.interface";
import { FormsModule } from "@angular/forms";
import { ReviewService } from "../../services/review.service";
import { UsuariosService } from "../../services/usuarios.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";

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
	puntuacion = 1;
	mostrarResenas = false;
	editandoReviewId: number | null = null;
	reviewEditada = "";
	puntuacionEditada = 5;
	private reviewService = inject(ReviewService);
	private usuariosService = inject(UsuariosService);
	token: string = localStorage.getItem("token") || "";
	usuarioId: number | null = null;

	@ViewChildren("ultimaResenaRef") resenaElements!: QueryList<ElementRef>; // Seleccionamos las reseñas
	private cdr = inject(ChangeDetectorRef); // Inyectamos ChangeDetectorRef

	async ngOnInit() {
		if (this.viajeId) {
			const usuario = await this.usuariosService.getPerfilUsuario();
			this.usuarioId = usuario.id_usuario;

			await this.cargarReviews();
		}
	}

	async cargarReviews() {
		try {
			const reviews = await this.reviewService.getByViajeId(this.viajeId);

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
				const reviewPayload = {
					usuarios_id_usuario: this.usuarioId,
					viajes_id_viaje: this.viajeId,
					puntuacion: this.puntuacion,
					review: this.nuevaReview,
					fecha: new Date().toISOString().split("T")[0],
				};

				await this.reviewService.createReview(
					this.viajeId,
					{ review: this.nuevaReview, puntuacion: this.puntuacion },
					reviewPayload,
				);
				this.nuevaReview = "";
				this.puntuacion = 1;
				await this.cargarReviews();
				this.mostrarResenas = true; // Abrir el desplegable de reseñas
				this.cdr.detectChanges(); // Forzamos la detección de cambios para asegurar que el DOM esté actualizado
				this.scrollToLastReview(); // Desplazarse a la última reseña
			}
		} catch (error) {
			Swal.fire({
				toast: true,
				position: "top-end",
				icon: "error",
				title: "Error al enviar la reseña",
				text: "Revisa tu conexión o intenta más tarde.",
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			
		}
	}

	// Desplazarse hacia la última reseña
	scrollToLastReview() {
		setTimeout(() => {
			const elementos = this.resenaElements.toArray();
			if (elementos.length > 0) {
				const ultima = elementos[elementos.length - 1];
				ultima.nativeElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}, 100); // pequeño delay para asegurar que el DOM ya se actualizó
	}

	activarEdicion(review: Review) {
		this.editandoReviewId = review.id_review ?? null;
		this.reviewEditada = review.review;
		this.puntuacionEditada = review.puntuacion;
	}

	cancelarEdicion() {
		this.editandoReviewId = null;
		this.reviewEditada = "";
		this.puntuacionEditada = 5;
	}

	async guardarEdicion(review: Review) {
		try {
			if (this.editandoReviewId !== null) {
				const payload = {
					puntuacion: this.puntuacionEditada,
					review: this.reviewEditada,
					fecha: new Date().toISOString().split("T")[0],
					usuarios_id_usuario: review.usuarios_id_usuario,
					viajes_id_viaje: review.viajes_id_viaje,
				};
				console.log(
					"📤 Editando review con ID:",
					this.editandoReviewId,
					payload,
				);
				await this.reviewService.updateReview(this.editandoReviewId, payload);
				this.editandoReviewId = null;
				await this.cargarReviews();
			}
		} catch (error) {
			console.error(" Error al editar la reseña", error);
		}
	}



	async eliminarReview(idReview: number) {
		const ToastConfirm = Swal.mixin({
		  toast: true,
		  position: "top-end",
		  showConfirmButton: true,
		  showCancelButton: true,
		  confirmButtonText: "Sí, eliminar",
		  cancelButtonText: "Cancelar",
		  background: "#fff3cd",
		  color: "#856404",
		  iconColor: "#ffc107",
		  customClass: {
			popup: "colored-toast",
			confirmButton: "swal2-confirm swal2-styled",
			cancelButton: "swal2-cancel swal2-styled",
		  },
		});
	  
		const resultado = await ToastConfirm.fire({
		  icon: "warning",
		  title: "¿Eliminar reseña?",
		  text: "No podrás recuperarla.",
		});
	  
		if (resultado.isConfirmed) {
		  try {
			await this.reviewService.deleteReview(idReview);
	  
			await this.cargarReviews?.();
	  
			Swal.fire({
			  toast: true,
			  position: "top-end",
			  icon: "success",
			  title: "Reseña eliminada",
			  showConfirmButton: false,
			  timer: 2000,
			  timerProgressBar: true,
			  background: "#d4edda",
			  color: "#155724",
			  iconColor: "#28a745",
			});
	  
		  } catch (error) {
			console.error("Error al eliminar reseña", error);
			Swal.fire({
			  toast: true,
			  position: "top-end",
			  icon: "error",
			  title: "Error al eliminar la reseña",
			  showConfirmButton: false,
			  timer: 2000,
			  timerProgressBar: true,
			  background: "#f8d7da",
			  color: "#721c24",
			  iconColor: "#dc3545",
			});
		  }
		}
	  }
}
