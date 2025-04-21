import { Component, Input, inject } from "@angular/core";
import { ParticipantesService } from "../../services/participantes.service";
import type { Participante } from "../../../../interfaces/participante.interface";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-participantes",
	imports: [RouterLink, CommonModule],
	templateUrl: "./participantes.component.html",
	styleUrls: ["./participantes.component.css"],
	standalone: true,
})
export class ParticipantesComponent {
	@Input() participantes: Participante[] = [];
	@Input() esAnfitrion = false;
	@Input() viajeId = 0;
	private participantesService: ParticipantesService =
		inject(ParticipantesService);

	ngOnInit() {
		console.log(this.participantes);
	}

	async cambiarEstado(event: Event, id_usuario: number) {
		const select = event.target as HTMLSelectElement;

		const p = this.participantes.find((p) => p.id_usuario === id_usuario);
		if (!p) {
			console.error("Participante no encontrado");
			return;
		}

		const response = await this.participantesService.cambiarEstadoParticipante(
			id_usuario,
			select.value,
			this.viajeId,
		);
		p.status = select.value as "pendiente" | "confirmado" | "rechazado";
	}
}
