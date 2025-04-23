import { Injectable } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import  { HttpClient, HttpHeaders} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import type { Notificacion } from "../../../interfaces/notificacion.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private baseUrl = 'http://localhost:3000/api/notificaciones';

  constructor(private httpClient: HttpClient) {}

  obtenerNotificaciones(token: string): Promise<Notificacion[]> {
    const headers = new HttpHeaders().set("Authorization", token)
    return lastValueFrom(
      this.httpClient.get<Notificacion[]>(`${this.baseUrl}`,
				{ headers },
      )
    );
  }  

  marcarComoLeido(idNotificacion: number) {
    return lastValueFrom(
      this.httpClient.put(`${this.baseUrl}/leido/${idNotificacion}`, {})
    );
  }
}
