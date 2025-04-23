import { Component, inject } from "@angular/core";
import { NotificacionesService } from "../../services/notificaciones.service";
import type { Notificacion } from "../../../../interfaces/notificacion.interface";
@Component({
	selector: "notificaciones",
	imports: [],
	templateUrl: "./notificaciones.component.html",
	styleUrls: ["./notificaciones.component.css"],
	standalone: true,
})
export class NotificacionesComponent {
	private notificacionesService = inject(NotificacionesService);

	notificaciones: Notificacion[] = [];
	token: string = localStorage.getItem("token") || "null";

	async ngOnInit(): Promise<void> {
		console.log(this.token)

		try {
			this.notificaciones = await this.notificacionesService.obtenerNotificaciones(this.token);
			console.log("###", this.notificaciones)
		} catch (err) {
			console.error("Error al cargar notificaciones:", err);
		}

	}

	async marcarComoLeido(id: number) {
		try {
			await this.notificacionesService.marcarComoLeido(id);
			this.notificaciones = this.notificaciones.filter((n) => n.id_notificacion !== id);
		} catch (err) {
			console.error("Error al marcar como leído:", err);
		}
	}
	isDropdownOpen = false;
toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

}
