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
import Swal from "sweetalert2";
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
	mostrarImagen = false;

	perfilUsuarioForm: FormGroup = new FormGroup({
		name: new FormControl("", [Validators.required]),
		email: new FormControl("", [Validators.required, Validators.email]),
		description: new FormControl(""),
		gender: new FormControl(""),
		hobbies: new FormControl(""),
		pets: new FormControl(""),
		photo: new FormControl(""),
	});

	toggleImagen() {
		this.mostrarImagen = !this.mostrarImagen;
	}

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
			console.log(formData);
		}
	}

	cancelarEdicion() {
		Swal.fire({
			toast: true,
			position: "top-end",
			icon: "info",
			title: "Cambios no guardados",
			text: "Se descartarán los cambios realizados.",
			showConfirmButton: false,
			timer: 2000,
			timerProgressBar: true,
			background: "#ffe0c2",
			color: "#383d41",
			iconColor: "#17a2b8",
		});

		setTimeout(() => {
			this.router.navigate(["/perfil-usuario"]);
		}, 2000);
	}

	onImagenSeleccionada(event: Event): void {
		const file = (event.target as HTMLInputElement)?.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				this.imagenPreview = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async eliminarPerfil() {
		if (!this.usuarioId) return;

		const ToastConfirm = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
			background: "#fff3cd",
			color: "#856404",
			iconColor: "#ffc107",
			customClass: {
				popup: "colored-toast",
				confirmButton: "swal2-confirm swal2-styled",
				cancelButton: "swal2-cancel swal2-styled",
			},
		});

		const resultado = await ToastConfirm.fire({
			icon: "warning",
			title: "¿Eliminar perfil?",
			text: "Esta acción no se puede deshacer.",
		});

		if (resultado.isConfirmed) {
			try {
				await this.usuariosService.eliminarUsuario(this.usuarioId);

				Swal.fire({
					toast: true,
					position: "top-end",
					icon: "success",
					title: "Perfil eliminado correctamente",
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					background: "#d4edda",
					color: "#155724",
					iconColor: "#28a745",
				});

				setTimeout(() => {
					localStorage.removeItem("token");
					this.router.navigate(["/"]);
				}, 2000);
			} catch (error) {
				console.error(error);
				Swal.fire({
					toast: true,
					position: "top-end",
					icon: "error",
					title: "Error al eliminar el perfil",
					showConfirmButton: false,
					timer: 2000,
					timerProgressBar: true,
					background: "#f8d7da",
					color: "#721c24",
					iconColor: "#dc3545",
				});
			}
		}
	}
}
