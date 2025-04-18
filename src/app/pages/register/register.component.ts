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
				title: "REGISTRO COMPLETADO",
				text: "Te has registrado correctamente",
				icon: "success",
				confirmButtonText: "Cerrar",
			});
			this.router.navigateByUrl("/login");
		} catch (error) {
			console.log(error);
		}
	}

	checkError(field: string, validator: string): boolean | undefined {
		return (
			this.formRegister.get(field)?.hasError(validator) &&
			this.formRegister.get(field)?.touched
		);
	}
}
