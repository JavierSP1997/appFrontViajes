import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import type { AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";
import { ciudades } from "../../data/ciudades.data";

@Component({
	selector: "app-publicar-viaje",
	imports: [ReactiveFormsModule],
	templateUrl: "./publicar-viaje.component.html",
	styleUrl: "./publicar-viaje.component.css",
})
export class PublicarViajeComponent {
	
	private viajesService = inject(ViajesService);
	private usuariosService = inject(UsuariosService);
	private router = inject(Router);

	ciudadesSpain: string[] = ciudades;
	ciudadesFiltradas: string[] = [];

	viajeForm: FormGroup = new FormGroup({
		nombre_viaje: new FormControl("", [
			Validators.required,
			Validators.pattern(/^[\p{L}\s]{3,}$/u),
		]),
		fecha_inicio: new FormControl("", [Validators.required]),
		fecha_fin: new FormControl("", [Validators.required]),
		coste_por_persona: new FormControl("", [
			Validators.required,
			Validators.min(1),
		]),
		personas_minimas: new FormControl("", [
			Validators.required,
			Validators.min(1),
			Validators.max(10),
		]),
		localizacion: new FormControl("", [Validators.required]),
		itinerario: new FormControl("", [
			Validators.required,
		]),
		imagen: new FormControl(""),
	},
	this.fechasValidas.bind(this)
);

	async onSubmit() {
		if (this.viajeForm.valid) {
			try {
				const usuario = await this.usuariosService.getPerfilUsuario();
				const nuevoViaje = {
					...this.viajeForm.value,
					usuarios_id_usuario: usuario.id_usuario,
				};

				const viajeCreado = await this.viajesService.crearViaje(nuevoViaje);
				this.router.navigate([`/viajes/${viajeCreado.id_viaje}`]);
			} catch (error) {
				console.error("Error al crear el viaje:", error);
			}
		}
	}

	checkError(controlName: string, error: string) {
		return (
			this.viajeForm.get(controlName)?.touched &&
			this.viajeForm.get(controlName)?.hasError(error)
		);
	}

	volverAtras() {
		this.router.navigate(["/perfil-usuario"]);
	}
	fechasValidas(control: AbstractControl): { fechaInvalida: boolean } | null {
		const formulario = control as FormGroup;
		const fechaInicio = formulario.get("fecha_inicio")?.value;
		const fechaFin = formulario.get("fecha_fin")?.value;
		const inicio = new Date(fechaInicio);
		const fin = new Date(fechaFin);
		if (fechaInicio && fechaFin && fin <= inicio) {
			return { fechaInvalida: true };
		}
		return null;
	}

	filtrarCiudades() {
		const input = this.viajeForm.get('localizacion')?.value.toLowerCase().trim() || '';
		this.ciudadesFiltradas = input
			? this.ciudadesSpain.filter(c => c.toLowerCase().includes(input))
			: [];
	}
	
	seleccionarCiudad(ciudad: string) {
		this.viajeForm.get('localizacion')?.setValue(ciudad);
		this.ciudadesFiltradas = [];
	}
	
}
