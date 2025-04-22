import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UsuariosService } from "../../services/usuarios.service";
import { emailExisteValidator } from "../../validators/checkEmail.validator";
import Swal from "sweetalert2";

@Component({
	selector: "app-register",
	imports: [ReactiveFormsModule, RouterLink],
	templateUrl: "./register.component.html",
	styleUrl: "./register.component.css",
})
export class RegisterComponent {
	router = inject(Router);
	usuariosService = inject(UsuariosService);

	formRegister: FormGroup = new FormGroup({
		nombre: new FormControl("", [Validators.required, Validators.minLength(3)]),
		email: new FormControl(
			"",
			[Validators.required, Validators.email],
			[emailExisteValidator(this.usuariosService)],
		),
		password: new FormControl("", [
			Validators.required,
			Validators.minLength(6),
			Validators.pattern(/^[A-Z][A-Za-z\d]*\d+/),
		]),
	});

	async onSubmit() {
		try {
			const staff = await this.usuariosService.register(
				this.formRegister.value,
			);
			Swal.fire({
				title: "¡Registro completado!",
				text: "Te has registrado correctamente.",
				icon: "success",
				toast: true,
				position: "top-end",
				timer: 3000,
				showConfirmButton: false,
				background: "#f0fff4", 
				color: "#065f46",
			});			
			this.router.navigateByUrl("/login");
		} catch (error) {
			Swal.fire({
				title: "¡Error!",
				text: "No se pudo completar el registro.",
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
			this.formRegister.get(field)?.hasError(validator) &&
			this.formRegister.get(field)?.touched
		);
	}
}
