import { Injectable } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import  { HttpClient, HttpHeaders} from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import type { ActualizaNotifiacion, Notificacion, NuevaNotifiacion } from "../../../interfaces/notificacion.interface";

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

  actualizarNotificacion(idNotificacion: number, notification: ActualizaNotifiacion, token: string) {

    const headers = new HttpHeaders().set("Authorization", token)

    return lastValueFrom(
      this.httpClient.put(`${this.baseUrl}/${idNotificacion}`,
        notification,
        { headers },
      )
    );
  }

  nuevaNotificacion(notificacion: NuevaNotifiacion, token: string) {
    
    const headers = new HttpHeaders().set("Authorization", token)
    return lastValueFrom(
      this.httpClient.post(
        `${this.baseUrl}`, notificacion, { headers },
      )
    );

  }
}
