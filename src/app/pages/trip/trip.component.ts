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

	viaje: Viaje | null = null;
	participantes: Participante[] = [];
	anfitrion: Anfitrion | null = null;
	usuarioLogado: Usuario | null = null;
	esAnfitrion = false;
	esParticipante = false;
	cargado = false;
	error = false;

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
			console.error("Error al cargar los datos del viaje:", err);
			this.error = true;
		} finally {
			this.cargado = true;
		}
	}

	async unirse() {
		if (this.viaje && this.usuarioLogado) {
			try {
				await this.viajesService.unirseAlViaje(
					this.viaje.id_viaje,
					this.usuarioLogado.id_usuario,
				);
				alert("Solicitud enviada");
				location.reload();
			} catch (err) {
				console.error("Error al unirse al viaje:", err);
				alert("No se pudo enviar la solicitud");
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
