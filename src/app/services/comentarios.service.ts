import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { lastValueFrom } from "rxjs";
import type { Comentario } from "../../../interfaces/comentario.interface";

@Injectable({
	providedIn: "root",
})
export class ComentariosService {
	private httpClient = inject(HttpClient);
	private apiUrl = "http://localhost:3000/api/comentarios";

	obtenerComentarios(viajeId: number) {
		return lastValueFrom(
			this.httpClient.get<Comentario[]>(`${this.apiUrl}/${viajeId}`),
		);
	}

	agregarComentario(viajeId: number, comentario: string, token: string) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
			this.httpClient.post(
				`${this.apiUrl}/${viajeId}`,
				{ comentario },
				{ headers },
			),
		);
	}

	editarComentario(
		viajeId: number,
		comentarioId: number,
		comentario: string,
		token: string,
	) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
			this.httpClient.put(
				`${this.apiUrl}/${viajeId}/${comentarioId}`,
				{ comentario },
				{ headers },
			),
		);
	}

	eliminarComentario(viajeId: number, comentarioId: number, token: string) {
		const headers = new HttpHeaders().set("Authorization", token);
		return lastValueFrom(
			this.httpClient.delete(`${this.apiUrl}/${viajeId}/${comentarioId}`, {
				headers,
			}),
		);
	}
}
