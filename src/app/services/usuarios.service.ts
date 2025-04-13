import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';


type Body = { nombre?: string, email: string, password: string };
type LoginResponse = { message: string, token: string };

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/usuarios';

  login(body: Body) {
      return lastValueFrom(
        this.httpClient.post<LoginResponse>(`${this.baseUrl}/login`, body)
      );
    }



    //register
  }
