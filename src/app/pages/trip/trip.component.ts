import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";

@Component({
	selector: "app-trip",
	standalone: true,
	imports: [CommonModule, ComentariosComponent],
	templateUrl: "./trip.component.html",
	styleUrl: "./trip.component.css",
})
export class TripComponent {
	private viajesService = inject(ViajesService);
	private route = inject(ActivatedRoute);

	viaje: Viaje | null = null;
	error = false;

	ngOnInit(): void {
		const id = Number(this.route.snapshot.paramMap.get("idViaje"));

		if (id) {
			this.viajesService.getViajeById(id).subscribe({
				next: (res) => {
					this.viaje = Array.isArray(res) ? (res[0] ?? null) : null;
					if (!this.viaje) this.error = true;
				},
				error: (err) => {
					console.error("Error al cargar el viaje", err);
					this.error = true;
				},
			});
		} else {
			this.error = true;
		}
	}

	redirectToViajes() {
		window.location.href = "/viajes";
	}
}
