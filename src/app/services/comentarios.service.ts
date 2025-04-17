import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { lastValueFrom } from "rxjs";
import type { Comentario } from "../../../interfaces/comentario.interface";

@Injectable({
	providedIn: "root",
})
export class ComentariosService {
	private httpClient = inject(HttpClient);
	private apiUrl = "http://localhost:3000/api/viajes";

	obtenerComentarios(viajeId: number) {
		return lastValueFrom(
			this.httpClient.get<Comentario[]>(
				`${this.apiUrl}/${viajeId}/comentarios`,
			),
		);
	}

	agregarComentario(viajeId: number, comentario: string, token: string) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
			this.httpClient.post(
				`${this.apiUrl}/${viajeId}/comentarios`,
				{ comentario },
				{ headers },
			),
		);
	}
}
