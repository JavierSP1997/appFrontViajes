import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Comentario } from "../../../interfaces/comentario";
import { lastValueFrom } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ComentariosService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/viajes";

	obtenerComentarios(viajeId: number) {
		return lastValueFrom(
			this.httpClient.get<Comentario[]>(
				`${this.baseUrl}/${viajeId}/comentarios`,
			),
		);
	}

	crearComentario(
		viajeId: number,
		body: {
			usuarios_id_usuario: number;
			viajes_id_viaje: number;
			comentario: string;
		},
	) {
		return lastValueFrom(
			this.httpClient.post(`${this.baseUrl}/${viajeId}/comentarios`, body),
		);
	}
}
