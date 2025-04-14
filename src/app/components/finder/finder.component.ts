// finder.component.ts
import {
  Component,
  EventEmitter,
  Output,
  inject,
  type OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finder.component.html',
})
export class FinderComponent implements OnInit {
  nombre = '';
  fecha_inicio = '';
  fecha_fin = '';
  personas_minimas: number | null = null;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  @Output() viajesFiltrados = new EventEmitter<any[]>();

  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    // Si hay parámetros en la URL, prellenar los inputs
    const queryParams = this.route.snapshot.queryParams;

    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    this.nombre = queryParams['nombre'] || '';
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    this.fecha_inicio = queryParams['fecha_inicio'] || '';
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    this.fecha_fin = queryParams['fecha_fin'] || '';
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    this.personas_minimas = queryParams['personas_minimas']
      ? // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        Number.parseInt(queryParams['personas_minimas'], 10)
      : null;
  }

  buscar() {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const queryParams: any = {};

    if (this.nombre) queryParams.nombre = this.nombre;
    if (this.fecha_inicio) queryParams.fecha_inicio = this.fecha_inicio;
    if (this.fecha_fin) queryParams.fecha_fin = this.fecha_fin;
    if (this.personas_minimas)
      queryParams.personas_minimas = this.personas_minimas;

    this.router.navigate(['/viajes'], {
      queryParams,
    });
  }
}
