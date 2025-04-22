import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { UsuariosService } from "../../services/usuarios.service";
import { Router } from "@angular/router";
import type { Usuario } from "../../../../interfaces/usuario.interface";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-edit-user-profile",
	imports: [ReactiveFormsModule, CommonModule, FormsModule],
	templateUrl: "./edit-user-profile.component.html",
	styleUrl: "./edit-user-profile.component.css",
})
export class EditUserProfileComponent {
	usuarioId: number | null = null;
	usuarioOriginal: Usuario | null = null;
	imagenPreview: string | null = null;
	usuariosService = inject(UsuariosService);
	private router = inject(Router);

	perfilUsuarioForm: FormGroup = new FormGroup({
		name: new FormControl("", [Validators.required]),
		email: new FormControl("", [Validators.required, Validators.email]),
		description: new FormControl(""),
		gender: new FormControl(""),
		hobbies: new FormControl(""),
		pets: new FormControl(""),
		photo: new FormControl(""),
	});

	async ngOnInit() {
		const usuario = await this.usuariosService.getPerfilUsuario();
		if (usuario) {
			this.usuarioId = usuario.id_usuario;
			this.usuarioOriginal = usuario;
			this.perfilUsuarioForm.patchValue({
				name: usuario.nombre,
				email: usuario.email,
				description: usuario.descripcion,
				gender: usuario.gender,
				hobbies: usuario.hobbies,
				pets: usuario.pets,
				photo: usuario.imagen,
			});
		}
	}

	async onSubmit() {
		if (
			this.perfilUsuarioForm.valid &&
			this.usuarioId !== null &&
			this.usuarioOriginal !== null
		) {
			const formValue = this.perfilUsuarioForm.value;
			const formData: Usuario = {
				id_usuario: this.usuarioId,
				nombre: formValue.name || "",
				email: formValue.email || "",
				descripcion: formValue.description || "",
				gender: formValue.gender || null,
				hobbies: formValue.hobbies || "",
				pets: formValue.pets || "",
				imagen: formValue.photo || "",
				fecha_registro: this.usuarioOriginal.fecha_registro,
				password: this.usuarioOriginal.password,
			};

			await this.usuariosService.update(this.usuarioId, formData);
			this.router.navigate(["/perfil-usuario"]);
		}
	}

	cancelarEdicion() {
		this.router.navigate(["/perfil-usuario"]);
	}

	onImagenSeleccionada(event: Event): void {
		const file = (event.target as HTMLInputElement)?.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				this.imagenPreview = reader.result as string;
			};
			reader.readAsDataURL(file);		}
	}
			// Opcional: guardar archivo para enviarlo al backend
			// this.formulario.patchValue({ imagen: file });

	async eliminarPerfil() {
		const confirmacion = confirm(
			"¿Estás seguro de que quieres eliminar tu perfil? Esta acción no se puede deshacer.",
		);

		if (confirmacion && this.usuarioId) {
			try {
				await this.usuariosService.eliminarUsuario(this.usuarioId);
				alert("Perfil eliminado correctamente.");
				this.router.navigate(["/"]);
			} catch (error) {
				console.error(error);
				alert("Hubo un error al eliminar el perfil.");
			}
		}
	}
}
