import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import { Router, RouterLink } from "@angular/router";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
@Component({
	selector: "app-login",
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.css",
})
export class LoginComponent {
	usuariosService = inject(UsuariosService);
	router = inject(Router);

	formLogin: FormGroup = new FormGroup({
		email: new FormControl("", [Validators.required, Validators.email]),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(6),
			Validators.pattern(/^[A-Z][A-Za-z\d]*\d+/),
		]),
	});

	async onSubmit() {
		console.log("Datos del formulario:", this.formLogin.value);
		if (this.formLogin.invalid) return;

		try {
			const response = await this.usuariosService.login(this.formLogin.value);

			Swal.fire({
				toast: true,
				position: "top-end",
				icon: "info",
				title: "¡Login existoso!",
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				background: "#f0f9ff",
				color: "#0369a1",
				iconColor: "#0ea5e9",
			});
			setTimeout(() => {
				localStorage.setItem("token", response.token);
				this.router.navigate(["/"]).then(() => {
					window.location.reload();
				});
			}, 2000);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (msg: any) {
			console.error("Error en el login", msg.error.error);
			Swal.fire({
				title: "¡Error!",
				text: msg.error.error || "Usuario o contraseña incorrectos.",
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
	checkError(field: string, validator: string): boolean | undefined {
		return (
			this.formLogin.get(field)?.hasError(validator) &&
			this.formLogin.get(field)?.touched
		);
	}
}
