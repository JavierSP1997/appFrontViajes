import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { lastValueFrom, map } from "rxjs";
import type { Usuario } from "../../../interfaces/usuario.interface";

type Body = { nombre?: string; email: string; password: string };
type LoginResponse = { message: string; token: string };

@Injectable({
	providedIn: "root",
})
export class UsuariosService {
	private httpClient = inject(HttpClient);
	private baseUrl = "http://localhost:3000/api/usuarios";

	getAll() {
		return lastValueFrom(this.httpClient.get<Usuario[]>(`${this.baseUrl}`));
	}

	login(body: Body) {
		return lastValueFrom(
			this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, body),
		);
	}

	register(body: Body) {
		return lastValueFrom(
			this.httpClient.post<Usuario>(`${this.baseUrl}/register`, body),
		);
	}

	getById(id: number) {
		return lastValueFrom(this.httpClient.get<Usuario>(`${this.baseUrl}/${id}`));
	}

  update(id: number, body: Usuario | FormData) {
    return lastValueFrom(
      this.httpClient.put<Usuario>(`${this.baseUrl}/${id}`, body)
    );
  }
  
	emailExiste(email: string) {
		return lastValueFrom(
			this.httpClient
				.get<{ existe: boolean }>(`${this.baseUrl}/check-email?email=${email}`)
				.pipe(map((res) => res.existe)),
		);
	}
}