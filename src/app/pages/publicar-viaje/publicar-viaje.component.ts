import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";

@Component({
	selector: "app-publicar-viaje",
	imports: [ReactiveFormsModule],
	templateUrl: "./publicar-viaje.component.html",
	styleUrl: "./publicar-viaje.component.css",
})
export class PublicarViajeComponent {
	private viajesService = inject(ViajesService);
	private router = inject(Router);

	viajeForm: FormGroup = new FormGroup({
		nombre_viaje: new FormControl("", [Validators.required]),
		fecha_inicio: new FormControl("", [Validators.required]),
		fecha_fin: new FormControl("", [Validators.required]),
		coste_por_persona: new FormControl("", [Validators.required]),
		personas_minimas: new FormControl("", [Validators.required]),
		localizacion: new FormControl("", [Validators.required]),
		itinerario: new FormControl("", [Validators.required]),
		imagen: new FormControl(""),
	});

	onSubmit() {
		if (this.viajeForm.valid) {
			const nuevoViaje = {
				...this.viajeForm.value,
				usuarios_id_usuario: 27, // más adelante sacaremos esto del token
			};

			this.viajesService
				.crearViaje(nuevoViaje)
				.then((viajeCreado) => {
					console.log("✅ Viaje creado:", viajeCreado);
					this.router.navigate(["/viajes", viajeCreado.id_viaje]);
				})
				.catch((err) => {
					console.error("❌ Error al crear viaje:", err);
				});
		} else {
			console.warn("⚠️ Formulario inválido");
			console.log(this.viajeForm);
		}
	}

	checkError(controlName: string, error: string) {
		return (
			this.viajeForm.get(controlName)?.touched &&
			this.viajeForm.get(controlName)?.hasError(error)
		);
	}
}
