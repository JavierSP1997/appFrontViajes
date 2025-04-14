import { Component } from '@angular/core';

@Component({
  selector: 'app-finder',
  imports: [],
  templateUrl: './finder.component.html',
  styleUrl: './finder.component.css',
})
export class FinderComponent {
  arrViajes: Viajes[] = [];

  async onInput($event: Event) {
    //go to url /viajes, y lu8ego que haga el filtro
    const { value } = $event.target as HTMLInputElement; //destructuring: solo quiero extraer la variable value de todo el objeto recibido
    try {
      if (value === '') {
        this.loadViajes();
      } else {
        this.arrViajes = await this.viajesService.getViajeByNombre(value);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
