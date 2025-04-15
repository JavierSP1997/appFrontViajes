import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { UsuariosService } from "../../services/usuarios.service";

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
		nombre: new FormControl(),
		email: new FormControl(),
		password: new FormControl(),
	});

	async onSubmit() {
		try {
			const staff = await this.usuariosService.register(
				this.formRegister.value,
			);
			alert("Registro correcto");
			this.router.navigateByUrl("/login");
		} catch (error) {
			console.log(error);
		}
	}
}
