import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Viaje } from '../../../interfaces/viaje.interface';

@Injectable({

  providedIn: 'root'
})
export class ViajesService {

  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/viajes';
  //mirar bien lo del enviroment
  getLastTrip() {
    return this.httpClient.get<Viaje[]>(`${this.baseUrl}`)
  }
}