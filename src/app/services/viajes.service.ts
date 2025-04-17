import { HttpClient } from "@angular/common/http";
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
}
