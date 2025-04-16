import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";
import Swal from "sweetalert2";

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const token = localStorage.getItem("token");

	if (token) {
		return true;
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		Swal.fire({
			title: "Acceso restringido",
			text: "Tienes que iniciar sesión para continuar",
			icon: "error",
			confirmButtonText: "Aceptar",
		});
		return router.parseUrl("/login");
	}
};
