import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";
import { ParticipantesComponent } from "../../components/participantes/participantes.component";
import type { Participante } from "../../../../interfaces/participante.interface";
import type { Anfitrion } from "../../../../interfaces/anfitrion.interface";

@Component({
	selector: "app-trip",
	standalone: true,
	imports: [
		CommonModule,
		ComentariosComponent,
		ParticipantesComponent,
		RouterModule,
	],
	templateUrl: "./trip.component.html",
	styleUrls: ["./trip.component.css"],
})
export class TripComponent {
	private viajesService = inject(ViajesService);
	private route = inject(ActivatedRoute);

	viaje: Viaje | null = null;
	participantes: Participante[] = [];
	anfitrion: Anfitrion | null = null;
	error = false;

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get("idViaje"));

		if (id) {
			this.viajesService
				.getViajeById(id)
				.then((res) => {
					console.log("Viaje recibido:", res);
					this.viaje = res;
					this.participantes = res.participantes ?? [];
					this.anfitrion = res.anfitrion;

					console.log("Participantes:", this.participantes);
					console.log("Anfitrión:", this.anfitrion);
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
