import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import type { Usuario } from '../../../interfaces/usuario';

type Body = { nombre?: string; email: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/viajes';

  getAllviajes(body: Body) {
    return lastValueFrom(
      this.httpClient.get<LoginResponse>(`${this.baseUrl}/viajes`, body)
    );
  }
}
