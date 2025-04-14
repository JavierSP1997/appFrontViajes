import {
  Component,
  EventEmitter,
  inject,
  Output,
  type OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViajesService } from '../../services/viajes.service';
import type { Viaje } from '../../../../interfaces/viaje.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- AÑADIDO

@Component({
  selector: 'app-finder',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- ACTUALIZADO
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.css'],
})
export class FinderComponent implements OnInit {
  @Output() viajesFiltrados = new EventEmitter<Viaje[]>();

  viajesService = inject(ViajesService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  destino = '';
  fechaIda = '';
  fechaVuelta = '';
  viajeros = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      this.destino = params['nombre'] || '';
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      this.fechaIda = params['fecha_inicio'] || '';
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      this.fechaVuelta = params['fecha_fin'] || '';
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      this.viajeros = params['personas_minimas'] || '';

      if (this.router.url.startsWith('/viajes') && Object.keys(params).length) {
        await this.filtrar();
      }
    });
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const params: any = {
      ...(this.destino && { nombre: this.destino }),
      ...(this.fechaIda && { fecha_inicio: this.fechaIda }),
      ...(this.fechaVuelta && { fecha_fin: this.fechaVuelta }),
      ...(this.viajeros && { personas_minimas: this.viajeros }),
    };

    if (this.router.url !== '/viajes') {
      this.router.navigate(['/viajes'], { queryParams: params });
    } else {
      await this.filtrar(params);
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  async filtrar(paramsOverride?: any) {
    const params = paramsOverride ?? {
      ...(this.destino && { nombre: this.destino }),
      ...(this.fechaIda && { fecha_inicio: this.fechaIda }),
      ...(this.fechaVuelta && { fecha_fin: this.fechaVuelta }),
      ...(this.viajeros && { personas_minimas: this.viajeros }),
    };

    try {
      const viajes = await this.viajesService.getAllViajes(params);
      this.viajesFiltrados.emit(viajes);
    } catch (error) {
      console.error(error);
    }
  }
}
