import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { ViajesService } from "../../services/viajes.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { DatePipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import Swal from "sweetalert2";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "app-mis-viajes",
	imports: [DatePipe, FormsModule, RouterLink],
	templateUrl: "./mis-viajes.component.html",
	styleUrl: "./mis-viajes.component.css",
})
export class MisViajesComponent {
	private usuariosService = inject(UsuariosService);
	private viajesService = inject(ViajesService);
	private router = inject(Router);
	token: string = localStorage.getItem("token") || "";

	
	usuarioIdLogado= 0
	filtroSeleccionado = 'todos';
	viajesCreados: Viaje[] = [];
	viajesParticipados: Viaje[] = [];
	viajesFinalizados: Viaje[] = [];

	viajesDelUsuario: Viaje[] = [];

	ordenTitulo: 'asc' | 'desc' = 'asc';
	ordenFecha: 'proxima' | 'lejana' = 'proxima';
	estadoParticipacion: 'confirmado' | 'pendiente' | 'rechazado' = 'confirmado';


	async ngOnInit() {
		try {
			const usuario = await this.usuariosService.getPerfilUsuario();
			this.usuarioIdLogado = usuario.id_usuario;
		
			this.viajesDelUsuario = await this.viajesService.getViajesByUsuario(this.usuarioIdLogado);
		
			this.refrescarListas();
			} catch (error) {
			console.log(error);
			}
		}
		
	refrescarListas(): void {
	const id = this.usuarioIdLogado;
	
		this.viajesCreados = this.viajesDelUsuario.filter(
		viaje => viaje.usuarios_id_usuario === id && viaje.estado !== 'finalizado'
		);
	
		this.viajesParticipados = this.viajesDelUsuario.filter(
		viaje =>
			viaje.participantes?.some(p => p.id_usuario === id) &&
			viaje.usuarios_id_usuario !== id &&
			viaje.estado !== 'finalizado'
		);
	
		this.viajesFinalizados = this.viajesDelUsuario.filter(
		viaje => viaje.estado === 'finalizado'
		);
	}
	
	ordenarViajes(): void {
		const ordenarPorFecha = (a: Viaje, b: Viaje) => {
		const fechaA = new Date(a.fecha_inicio).getTime();
		const fechaB = new Date(b.fecha_inicio).getTime();
			return this.ordenFecha === 'proxima' ? fechaA - fechaB : fechaB - fechaA;
		};
		this.refrescarListas();
		
		this.viajesCreados = [...this.viajesCreados].sort(ordenarPorFecha);
		this.viajesParticipados = [...this.viajesParticipados].sort(ordenarPorFecha);
		this.viajesFinalizados = [...this.viajesFinalizados].sort(ordenarPorFecha);
	}

	ordenarPorTitulo(): void {
		const ordenar = (a: Viaje, b: Viaje) => {
		const nombreA = a.nombre_viaje.toLowerCase();
		const nombreB = b.nombre_viaje.toLowerCase();
		return this.ordenTitulo === 'asc'
			? nombreA.localeCompare(nombreB)
			: nombreB.localeCompare(nombreA);
		};
	
		this.viajesCreados = [...this.viajesCreados].sort(ordenar);
		this.viajesParticipados = [...this.viajesParticipados].sort(ordenar);
		this.viajesFinalizados = [...this.viajesFinalizados].sort(ordenar);
	}

	get viajesParticipadosFiltrados(): Viaje[] {
		return this.viajesParticipados.filter(viaje =>
		viaje.participantes?.some(
			p => p.id_usuario === this.usuarioIdLogado && p.status === this.estadoParticipacion
		)
		);
	}
	
	
		
	irATrip(idViaje: number): void {
		this.router.navigate(["/viajes", idViaje]);
	}

	eliminarViaje(idViaje: number) {
		Swal.fire({
				toast: true,
				position: "top-end",
				icon: "warning",
				title: "¿Eliminar viaje?",
				text: "Se eliminará permanentemente. ¿Deseas continuar?",
				showCancelButton: true,
				confirmButtonText: "Sí, eliminar",
				cancelButtonText: "Cancelar",
				timerProgressBar: true,
				background: "#fff3cd",
				color: "#856404",
				iconColor: "#ffc107",
				showCloseButton: true,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await this.viajesService.removeViaje(idViaje, this.token);
					Swal.fire({
						title: "¡Viaje eliminado!",
						text: "El viaje ha sido eliminado con éxito.",
						icon: "success",
						toast: true,
						position: "top-end",
						timer: 3000,
						showConfirmButton: false,
						background: "#fefce8",
						color: "#713f12",
					});
					this.viajesDelUsuario = this.viajesDelUsuario.filter(
						(viaje) => viaje.id_viaje !== idViaje,
					);
					window.location.reload()
				} catch (err) {
					Swal.fire({
						title: "¡Error!",
						text: "No se pudo eliminar el viaje.",
						icon: "error",
						toast: true,
						position: "top-end",
						timer: 3000,
						showConfirmButton: false,
						background: "#fef2f2",
						color: "#991b1b",
					});
				}
			}
		});
	}



}


