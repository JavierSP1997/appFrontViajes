import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";
import { ParticipantesComponent } from "../../components/participantes/participantes.component";
import type { Participante } from "../../../../interfaces/participante.interface";
import type { Usuario } from "../../../../interfaces/usuario.interface";

@Component({
	selector: "app-trip",
	standalone: true,
	imports: [CommonModule, ComentariosComponent, ParticipantesComponent],
	templateUrl: "./trip.component.html",
	styleUrls: ["./trip.component.css"],
})
export class TripComponent {
	private viajesService = inject(ViajesService);
	private usuariosService = inject(UsuariosService);
	private route = inject(ActivatedRoute);

	viaje: Viaje | null = null;
	participantes: Participante[] = [];
	anfitrion: Usuario | null = null;
	error = false;

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get("idViaje"));

		if (id) {
			this.viajesService
				.getViajeById(id)
				.then(async (res) => {
					console.log("Viaje recibido:", res);
					this.viaje = res;
					this.participantes = res.participantes ?? [];
					console.log(this.participantes);

					// Traemos datos del anfitrión
					try {
						console.log("ID del anfitrión:", res.usuarios_id_usuario);
						this.anfitrion = await this.usuariosService.getById(
							res.usuarios_id_usuario,
						);
					} catch (error) {
						console.error("Error al obtener el anfitrión", error);
					}
				})
				.catch((err) => {
					console.error("Error al cargar el viaje", err);
					this.error = true;
				});
		} else {
			this.error = true;
		}
	}

	redirectToViajes() {
		window.location.href = "/viajes";
	}
}
