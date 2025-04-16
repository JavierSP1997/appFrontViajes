import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import type { Participante } from "../../../../interfaces/participante.interface";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-participantes",
	imports: [RouterModule, CommonModule],
	templateUrl: "./participantes.component.html",
	styleUrls: ["./participantes.component.css"],
})
export class ParticipantesComponent {
	@Input() participantes: Participante[] = [];
}
