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
	cargado = false;
	error = false;
	token: string = localStorage.getItem("token") || "";

	async ngOnInit(): Promise<void> {
		const id = Number(this.route.snapshot.paramMap.get("idViaje"));

		if (!id) {
			this.error = true;
			return;
		}

		try {
			this.viaje = await this.viajesService.getViajeById(id);
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
		} catch (err) {
			this.error = true;
		} finally {
			this.cargado = true;
		}
	}

	async unirse() {
		if (this.viaje && this.usuarioLogado) {
			try {
				await this.participantesService.unirseAlViaje(
					this.viaje.id_viaje,
					this.token,
				);
				Swal.fire({
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
				const viajeActualizado = await this.viajesService.getViajeById(
					this.viaje.id_viaje,
				);
				this.participantes = viajeActualizado.participantes ?? [];
				this.esParticipante = this.participantes.some(
					// el some es como hacer : 
					// let encontrado = false;
					// for (const p of this.participantes) {
					// 	if (p.id_usuario === this.usuarioLogado?.id_usuario) {
					// 		encontrado = true;
					// 	}
					// }
					// this.esParticipante = encontrado;
					(p) => p.id_usuario === this.usuarioLogado?.id_usuario,
				);
				// setTimeout(() => location.reload(), 3000);
			} catch (err) {
				Swal.fire({
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
	}

	async abandonar() {
		if (this.viaje && this.usuarioLogado) {
			try {
				await this.viajesService.abandonarViaje(
					this.viaje.id_viaje,
					this.usuarioLogado.id_usuario,
				);
				alert("Has abandonado el viaje");
				location.reload();
			} catch (err) {
				console.error("Error al abandonar el viaje:", err);
				alert("No se pudo abandonar el viaje");
			}
		}
	}

	redirectToViajes() {
		window.location.href = "/viajes";
	}
}
