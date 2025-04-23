import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";
import { ParticipantesComponent } from "../../components/participantes/participantes.component";
import type { Participante } from "../../../../interfaces/participante.interface";
import type { Anfitrion } from "../../../../interfaces/anfitrion.interface";
import type { Usuario } from "../../../../interfaces/usuario.interface";
import { ReviewsComponent } from "../../components/review/review.component";
import { ParticipantesService } from "../../services/participantes.service";
import Swal from "sweetalert2";

@Component({
	selector: "app-trip",
	standalone: true,
	imports: [
		CommonModule,
		ComentariosComponent,
		ParticipantesComponent,
		RouterModule,
		ReviewsComponent,
	],
	templateUrl: "./trip.component.html",
	styleUrls: ["./trip.component.css"],
})
export class TripComponent {
	private viajesService = inject(ViajesService);
	private usuariosService = inject(UsuariosService);
	private route = inject(ActivatedRoute);
	participantesService = inject(ParticipantesService);
	viaje: Viaje | null = null;
	participantes: Participante[] = [];
	anfitrion: Anfitrion | null = null;
	usuarioLogado: Usuario | null = null;
	esAnfitrion = false;
	esParticipante = false;
	esFinalizado = false;
	puedeComentar = false;
	cargado = false;
	error = false;
	progresoCupo = 0;
	token: string = localStorage.getItem("token") || "";

	async ngOnInit(): Promise<void> {
		const id = Number(this.route.snapshot.paramMap.get("idViaje"));

		if (!id) {
			this.error = true;
			return;
		}

		try {
			this.viaje = await this.viajesService.getViajeById(id);
			this.esFinalizado = this.viaje.estado === "finalizado";
			this.participantes = this.viaje.participantes ?? [];
			this.anfitrion = this.viaje.anfitrion;
			this.usuarioLogado = await this.usuariosService.getPerfilUsuario();
			this.esAnfitrion =
				this.usuarioLogado?.id_usuario === this.viaje?.usuarios_id_usuario;
			if (this.usuarioLogado && this.participantes.length > 0) {
				this.esParticipante = this.participantes.some(
					(p) => p.id_usuario === this.usuarioLogado?.id_usuario,
				);
			}
			this.puedeComentar =
				this.esAnfitrion ||
				this.participantes.some(
					(p) =>
						p.id_usuario === this.usuarioLogado?.id_usuario &&
						p.status === "confirmado",
				);

			// biome-ignore lint/complexity/useOptionalChain: <explanation>
			if (this.viaje && this.viaje.personas_minimas) {
				const cantidadActual = this.viaje.participantes?.length || 0;
				const cantidadMinima = this.viaje.personas_minimas;
				const porcentaje = Math.min(
					Math.floor((cantidadActual / cantidadMinima) * 100),
					100,
				);
				this.progresoCupo = porcentaje;
			}
		} catch (err) {
			this.error = true;
		} finally {
			this.cargado = true;
		}
		console.log(this.viaje);
	}

	async unirse() {
		if (!this.viaje || !this.usuarioLogado) return;

		const idViaje = this.viaje.id_viaje;
		const userId = this.usuarioLogado.id_usuario;
		const cooldownKey = `viaje-${idViaje}-usuario-${userId}-cooldown`;

		const ultimoIntento = localStorage.getItem(cooldownKey);
		const ahora = new Date().getTime();

		if (ultimoIntento) {
			const tiempoTranscurrido = ahora - Number(ultimoIntento);
			const horasPasadas = tiempoTranscurrido / (1000 * 60 * 60);

			if (horasPasadas < 24) {
				const horasRestantes = Math.floor(24 - horasPasadas);
				const minutosRestantes = Math.floor(
					(24 - horasPasadas - horasRestantes) * 60,
				);

				await Swal.fire({
					title: "Ya has solicitado unirte",
					text: `Debes esperar ${horasRestantes}h ${minutosRestantes}min para volver a intentarlo.`,
					icon: "info",
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 4000,
					background: "#e0f2fe",
					color: "#075985",
				});
				return;
			}
		}

		try {
			await this.participantesService.unirseAlViaje(idViaje, this.token);

			localStorage.setItem(cooldownKey, ahora.toString());

			await Swal.fire({
				title: "¡Solicitud enviada!",
				text: "Has pedido unirte al viaje con éxito.",
				icon: "success",
				toast: true,
				position: "top-end",
				timer: 3000,
				showConfirmButton: false,
				background: "#f0fff4",
				color: "#065f46",
			});

			// Actualizar lista de participantes
			const viajeActualizado = await this.viajesService.getViajeById(idViaje);
			this.participantes = viajeActualizado.participantes ?? [];

			// 🔽 Forzar re-render y mantener scroll
			const scrollY = window.scrollY;
			this.viaje.participantes = [...this.participantes];
			setTimeout(() => {
				window.scrollTo(0, scrollY);
			}, 0);

			this.esParticipante = this.participantes.some(
				(p) => p.id_usuario === userId,
			);

			// Actualizar el progreso del cupo
			this.actualizarProgresoCupo();
		} catch (err) {
			await Swal.fire({
				title: "¡Error!",
				text: "No se pudo enviar la solicitud.",
				icon: "error",
				toast: true,
				position: "top-end",
				timer: 3000,
				showConfirmButton: false,
				background: "#fef2f2",
				color: "#991b1b",
			});
		}
	}

	async abandonar() {
		if (this.viaje && this.usuarioLogado) {
			try {
				await this.participantesService.abandonarViaje(
					this.viaje.id_viaje,
					this.token,
				);

				const result = await Swal.fire({
					title: "¿Estás seguro?",
					text: "Estás a punto de abandonar el viaje. ¿Deseas continuar?",
					icon: "warning",
					showCancelButton: true,
					confirmButtonColor: "#d33",
					cancelButtonColor: "#3085d6",
					confirmButtonText: "Sí, abandonar",
					cancelButtonText: "No, cancelar",
				});

				if (!result.isConfirmed) {
					return;
				}

				Swal.fire({
					title: "¡Has abandonado el viaje!",
					text: "Esperamos que te unas a otro pronto.",
					icon: "success",
					toast: true,
					position: "top-end",
					timer: 3000,
					showConfirmButton: false,
					background: "#fefce8",
					color: "#713f12",
				});

				// Actualizar lista de participantes
				const viajeActualizado = await this.viajesService.getViajeById(
					this.viaje.id_viaje,
				);
				this.participantes = viajeActualizado.participantes ?? [];

				// 🔽 Forzar re-render y mantener scroll
				const scrollY = window.scrollY;
				this.viaje.participantes = [...this.participantes];
				setTimeout(() => {
					window.scrollTo(0, scrollY);
				}, 0);

				this.esParticipante = this.participantes.some(
					(p) => p.id_usuario === this.usuarioLogado?.id_usuario,
				);

				this.actualizarProgresoCupo();
			} catch (err) {
				Swal.fire({
					title: "¡Error!",
					text: "No se pudo abandonar el viaje.",
					icon: "error",
					toast: true,
					position: "top-end",
					timer: 3000,
					showConfirmButton: false,
					background: "#fef2f2",
					color: "#991b1b",
				});
			}
		}
	}

	actualizarProgresoCupo(): void {
		// biome-ignore lint/complexity/useOptionalChain: <explanation>
		if (this.viaje && this.viaje.personas_minimas) {
			const cantidadActual = this.viaje.participantes?.length || 0;
			const cantidadMinima = this.viaje.personas_minimas;
			const porcentaje = Math.min(
				Math.floor((cantidadActual / cantidadMinima) * 100),
				100,
			);
			this.progresoCupo = porcentaje;
		}
	}

	eliminarViaje() {
		if (this.viaje && this.usuarioLogado) {
			const idViaje = this.viaje.id_viaje;
			Swal.fire({
				title: "¿Estás seguro?",
				text: "Esta acción eliminará el viaje permanentemente. ¿Deseas continuar?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#d33",
				cancelButtonColor: "#3085d6",
				confirmButtonText: "Sí, eliminar",
				cancelButtonText: "No, cancelar",
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						await this.viajesService.removeViaje(idViaje, this.token);
						Swal.fire({
							title: "¡Viaje eliminado!",
							text: "El viaje ha sido eliminado con éxito.",
							icon: "success",
							toast: true,
							position: "top-end",
							timer: 3000,
							showConfirmButton: false,
							background: "#fefce8",
							color: "#713f12",
						});
						this.redirectToViajes();
					} catch (err) {
						Swal.fire({
							title: "¡Error!",
							text: "No se pudo eliminar el viaje.",
							icon: "error",
							toast: true,
							position: "top-end",
							timer: 3000,
							showConfirmButton: false,
							background: "#fef2f2",
							color: "#991b1b",
						});
					}
				}
			});
		}
	}

	async finalizarViaje(): Promise<void> {
		if (!this.viaje) return;

		const confirmacion = await Swal.fire({
			title: "¿Ya de vuelta?",
			text: "Estás por dar el viaje por terminado. ¿Estás seguro de que deseas continuar?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, finalizar",
			cancelButtonText: "Cancelar",
		});

		if (!confirmacion.isConfirmed) return;

		try {
			await this.viajesService.finalizarViaje(this.viaje.id_viaje);
			this.viaje.estado = "finalizado";
			this.esFinalizado = true;

			Swal.fire({
				icon: "success",
				title: "¡Viaje finalizado!",
				text: "El viaje se ha marcado como finalizado correctamente.",
				confirmButtonText: "Aceptar",
			});
		} catch (error) {
			console.error("Error al finalizar el viaje:", error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "No se pudo finalizar el viaje. Intenta de nuevo más tarde.",
				confirmButtonText: "Cerrar",
			});
		}
	}
	redirectToViajes() {
		window.location.href = "/viajes";
	}
}
