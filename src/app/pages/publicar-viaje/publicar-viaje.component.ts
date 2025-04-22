import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";

@Component({
	selector: "app-publicar-viaje",
	imports: [ReactiveFormsModule],
	templateUrl: "./publicar-viaje.component.html",
	styleUrl: "./publicar-viaje.component.css",
})
export class PublicarViajeComponent {
	ciudadesSpain: string[] = [
		"Almería",
		"Cádiz",
		"Córdoba",
		"Granada",
		"Huelva",
		"Jaén",
		"Málaga",
		"Sevilla",
		"Huesca",
		"Teruel",
		"Zaragoza",
		"Oviedo",
		"Santander",
		"A Coruña",
		"Lugo",
		"Ourense",
		"Pontevedra",
		"Palma de Mallorca",
		"Las Palmas de Gran Canaria",
		"Santa Cruz de Tenerife",
		"Ceuta",
		"Melilla",
		"Ávila",
		"Burgos",
		"León",
		"Palencia",
		"Salamanca",
		"Segovia",
		"Soria",
		"Valladolid",
		"Zamora",
		"Albacete",
		"Ciudad Real",
		"Cuenca",
		"Guadalajara",
		"Toledo",
		"Barcelona",
		"Girona",
		"Lleida",
		"Tarragona",
		"Alicante",
		"Castellón de la Plana",
		"Valencia",
		"Badajoz",
		"Cáceres",
		"Logroño",
		"Madrid",
		"Pamplona",
		"San Sebastián",
		"Bilbao",
		"Vitoria-Gasteiz",
		"Murcia",
	];
	private viajesService = inject(ViajesService);
	private usuariosService = inject(UsuariosService);
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
}
