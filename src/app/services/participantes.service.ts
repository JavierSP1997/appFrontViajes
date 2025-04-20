import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class ParticipantesService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/participantes";
	
	  unirseAlViaje(viajeId: number) {
		return this.httpClient.post(`${this.baseUrl}/participar/${viajeId}`, {});
	  }
	}
	