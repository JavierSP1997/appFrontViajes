import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, ReactiveFormsModule, Validators,type AbstractControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";

@Component({
	selector: "app-edit-viaje",
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: "./edit-viaje.component.html",
	styleUrl: "./edit-viaje.component.css",
})
export class EditViajeComponent {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private viajesService = inject(ViajesService);
	private usuariosService = inject(UsuariosService);

	viajeId = 0;
	viajeOriginal!: Viaje;
	esAnfitrion = false;

	viajeForm = new FormGroup({
		nombre_viaje: new FormControl("",[
			Validators.required,
			Validators.pattern(/^[\p{L}\s]{3,}$/u),
		]),

		fecha_inicio: new FormControl("",[Validators.required]),

		fecha_fin: new FormControl("", [Validators.required]),
		coste_por_persona: new FormControl("",[
			Validators.required,
			Validators.min(1),
		]),
		personas_minimas: new FormControl("",[
			Validators.required,
			Validators.min(1),
			Validators.max(10),
		]),
		localizacion: new FormControl("",[Validators.required]),
		itinerario: new FormControl("",[
			Validators.required,
			Validators.pattern(/^[\p{L}\s]{3,}$/u),
		]),
		imagen: new FormControl(""),
	},
	this.fechasValidas.bind(this)
);

	async ngOnInit() {
		const id = Number(this.route.snapshot.paramMap.get("id"));
		this.viajeId = id;

		const viaje = await this.viajesService.getViajeById(id);
		const usuario = await this.usuariosService.obtenerUsuarioActual();

		if (viaje && usuario) {
			this.viajeOriginal = viaje;
			this.esAnfitrion = usuario.id_usuario === viaje.usuarios_id_usuario;

			this.viajeForm.patchValue({
				nombre_viaje: viaje.nombre_viaje,
				fecha_inicio: viaje.fecha_inicio,
				fecha_fin: viaje.fecha_fin,
				coste_por_persona: viaje.coste_por_persona,
				personas_minimas: String(viaje.personas_minimas),
				localizacion: viaje.localizacion,
				itinerario: viaje.itinerario,
				imagen: viaje.imagen,
			});

			if (!this.esAnfitrion) {
				this.viajeForm.disable(); 
			}
		}
	}

	async guardarCambios() {
		if (this.viajeForm.valid && this.esAnfitrion) {
			const formValue = this.viajeForm.value;

			const datosViaje: Viaje = {
				id_viaje: this.viajeId,
				usuarios_id_usuario: this.viajeOriginal.usuarios_id_usuario,
				nombre_viaje: formValue.nombre_viaje || "",
				fecha_inicio: formValue.fecha_inicio || "",
				fecha_fin: formValue.fecha_fin || "",
				coste_por_persona: formValue.coste_por_persona || "",
				personas_minimas: Number(formValue.personas_minimas),
				localizacion: formValue.localizacion || "",
				itinerario: formValue.itinerario || "",
				imagen: formValue.imagen || "",
				participantes: this.viajeOriginal.participantes,
				anfitrion: this.viajeOriginal.anfitrion,
			};

			try {
				await this.viajesService.updateViaje(this.viajeId, datosViaje);
				this.router.navigate(["/mis-viajes"]);
			} catch (error) {
				console.error("Error al guardar los cambios", error);
				// Mostrar mensaje de error al usuario si es necesario
			}
		}
	}

	checkError(controlName: string, error: string) {
		return (
			this.viajeForm.get(controlName)?.touched &&
			this.viajeForm.get(controlName)?.hasError(error)
		);
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
	cancelar() {
		this.router.navigate(["/mis-viajes"]);
	}
}
