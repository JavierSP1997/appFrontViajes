import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ParticipantesService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/participantes";

	unirseAlViaje(viajeId: number, token: string) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
			this.httpClient.post(
				`${this.baseUrl}/participar/${viajeId}`,
				{},
				{ headers },
			),
		);
	}
	abandonarViaje(viajeId: number, token: string) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
		  this.httpClient.delete(`${this.baseUrl}/abandonar/${viajeId}`, { headers })
		);
	  }
	  
}
