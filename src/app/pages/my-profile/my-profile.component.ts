import { Component, inject } from "@angular/core";
import { UsuariosService } from "../../services/usuarios.service";
import type { Usuario } from "../../../../interfaces/usuario.interface";
// biome-ignore lint/style/useImportType: <explanation>
import { Router, RouterLink } from "@angular/router";
import Swal from "sweetalert2";
import { NotificacionesComponent } from "../../components/notificaciones/notificaciones.component";
@Component({
	selector: "app-my-profile",
	imports: [RouterLink],
	templateUrl: "./my-profile.component.html",
	styleUrl: "./my-profile.component.css",
})
export class MyProfileComponent {
	constructor(private router: Router) {}

	usuariosService = inject(UsuariosService);
	usuario: Usuario | null = null;

	async ngOnInit() {
		this.usuario = await this.usuariosService.getPerfilUsuario();
	}

	editarPerfil() {
		if (this.usuario?.id_usuario) {
			this.router.navigate([
				`/perfil-usuario/${this.usuario.id_usuario}/editar`,
			]);
		}
	}
	traductorDeGenero(gender: string): string {
		const genderMap: { [key: string]: string } = {
			male: "Masculino",
			female: "Femenino",
			other: "Otro",
		};
		return genderMap[gender];
	}

	get perfilIncompleto(): boolean {
		const u = this.usuario;
		return (
			!!u && (!u.gender || !u.hobbies?.length || !u.pets?.length || !u.imagen)
		);
	}
	async cerrarSesion() {
		const nombre = this.usuario?.nombre || "usuario";

		const ToastConfirm = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: true,
			showCancelButton: true,
			confirmButtonText: "Aceptar",
			cancelButtonText: "Cancelar",
			background: "#e0f2fe",
			color: "#0369a1",
			iconColor: "#0284c7",
			customClass: {
				popup: "colored-toast",
				confirmButton: "swal2-confirm swal2-styled",
				cancelButton: "swal2-cancel swal2-styled",
			},
		});

		const resultado = await ToastConfirm.fire({
			icon: "question",
			title: `¿Cerrar sesión, ${nombre}?`,
			text: "Tu sesión se cerrará y volverás al inicio.",
		});

		if (resultado.isConfirmed) {
			Swal.fire({
				toast: true,
				position: "top-end",
				icon: "info",
				title: `¡Hasta pronto, ${nombre}!`,
				showConfirmButton: false,
				timer: 2000,
				timerProgressBar: true,
				background: "#f0f9ff",
				color: "#0369a1",
				iconColor: "#0ea5e9",
			});

			setTimeout(() => {
				localStorage.removeItem("token");
				this.router.navigate(["/"]).then(() => {
					window.location.reload();
				});
			}, 2000);
		}
	}
}
