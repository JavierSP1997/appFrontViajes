import { Component, inject } from "@angular/core";
import { NotificacionesService } from "../../services/notificaciones.service";
import type { Notificacion } from "../../../../interfaces/notificacion.interface";
import { UsuariosService } from "../../services/usuarios.service";
import { ViajesService } from "../../services/viajes.service";

@Component({
	selector: "notificaciones",
	imports: [],
	templateUrl: "./notificaciones.component.html",
	styleUrls: ["./notificaciones.component.css"],
})
export class NotificacionesComponent {
	private notificacionesService = inject(NotificacionesService);
	isDropdownOpen = false;
	private userSvc   = inject(UsuariosService);
  private viajesSvc = inject(ViajesService);
	notificaciones: Notificacion[] = [];
	token: string = localStorage.getItem("token") || "null";

// 	async ngOnInit(): Promise<void> {
// 		console.log(this.token)

// 		try {
// 			this.notificaciones = await this.notificacionesService.obtenerNotificaciones(this.token);
// 			console.log("###", this.notificaciones)
// 		} catch (err) {
// 			console.error("Error al cargar notificaciones:", err);
// 		}

// 	}

// 	async marcarComoLeido(id: number) {
// 		try {
// 			await this.notificacionesService.marcarComoLeido(id);
// 			this.notificaciones = this.notificaciones.filter((n) => n.id_notificacion !== id);
// 		} catch (err) {
// 			console.error("Error al marcar como leído:", err);
// 		}
	
// }}

async ngOnInit(): Promise<void> {
    if (!this.token) return;

    try {
      this.notificaciones = await this.notificacionesService.obtenerNotificaciones(this.token);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async marcarComoLeido(id: number) {
    try {
      await this.notificacionesService.marcarComoLeido(id);
      this.notificaciones = this.notificaciones.filter(n => n.id_notificacion !== id);
    } catch (err) {
      console.error("Error al marcar como leído:", err);
    }
  }
}