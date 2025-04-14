import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import type { Viaje } from '../../../interfaces/viaje.interface';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/viajes';

  getLastViaje() {
    return this.httpClient.get<Viaje>(`${this.baseUrl}`);
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  getAllViajes(params?: any) {
    return lastValueFrom(
      this.httpClient.get<Viaje[]>(`${this.baseUrl}/viajes`, { params })
    );
  }

  getViajeByNombre(nombre: string) {
    return lastValueFrom(
      this.httpClient.get<Viaje[]>(`${this.baseUrl}/viajes`, {
        params: { nombre },
      })
    );
  }
}
