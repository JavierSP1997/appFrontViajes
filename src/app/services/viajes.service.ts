import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom, type Observable } from "rxjs";
import type { Viaje } from "../../../interfaces/viaje.interface";

@Injectable({
	providedIn: "root",
})
export class ViajesService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/viajes";

	getLastViaje() {
		return this.httpClient.get<Viaje[]>(`${this.baseUrl}`);
	}

	getAllViajes(): Promise<Viaje[]> {
		return lastValueFrom(this.httpClient.get<Viaje[]>(this.baseUrl));
	}

	getViajesByUsuario(idUsuario: number) {
		return lastValueFrom(
			this.httpClient.get<Viaje[]>(`${this.baseUrl}/usuario/${idUsuario}`),
		);
	}

	getViajeByNombre(nombre: string) {
		return lastValueFrom(
			this.httpClient.get<Viaje[]>(`${this.baseUrl}/viajes`, {
				params: { nombre },
			}),
		);
	}

	getViajeById(id: number): Promise<Viaje> {
		return lastValueFrom(this.httpClient.get<Viaje>(`${this.baseUrl}/${id}`));
	}

	crearViaje(nuevoViaje: Viaje): Promise<Viaje> {
		const token = localStorage.getItem("token");

		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
		});

		return lastValueFrom(
			this.httpClient.post<Viaje>(`${this.baseUrl}/nuevo`, nuevoViaje, {
				headers,
			}),
		);
	}

	unirseAlViaje(idViaje: number, idUsuario: number) {
		return this.httpClient.post("/api/participantes", {
			id_viaje: idViaje,
			id_usuario: idUsuario,
			status: "pendiente",
		});
	}
	updateViaje(idViaje: number, datosActualizados: Partial<Viaje>): Promise<Viaje> {
		const token = localStorage.getItem("token");
		const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`);
		const datosFormateados = {
			...datosActualizados,
			fecha_inicio: datosActualizados.fecha_inicio
				? new Date(datosActualizados.fecha_inicio).toISOString().split("T")[0]
				: undefined,
			fecha_fin: datosActualizados.fecha_fin
				? new Date(datosActualizados.fecha_fin).toISOString().split("T")[0]
				: undefined,
		};
	
		return lastValueFrom(
			this.httpClient.put<Viaje>(`${this.baseUrl}/${idViaje}`, datosFormateados, { headers })
		);
	}
	
	  
	abandonarViaje(idViaje: number, idUsuario: number) {
		return this.httpClient.delete(`/api/participantes/${idViaje}/${idUsuario}`);
	}
}
