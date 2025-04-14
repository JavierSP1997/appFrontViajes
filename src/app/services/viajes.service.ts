import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import type { Viajes } from '../../../interfaces/viajes';

type Body = { nombre?: string; email: string; password: string };

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/viajes';
  //mirar bien lo del enviroment

  getLastTrip() {
    return this.httpClient.get<any>(`${this.baseUrl}`);
  }

  getAllviajes(body: Body) {
    return lastValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}/viajes`, body)
    );
  }
}
