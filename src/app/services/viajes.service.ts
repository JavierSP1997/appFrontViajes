import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({

  providedIn: 'root'
})
export class ViajesService {

  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/viajes';
  //mirar bien lo del enviroment
  getLastTrip() {
    return this.httpClient.get<any>(`${this.baseUrl}`)
  }
}