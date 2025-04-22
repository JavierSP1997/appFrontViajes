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
			title:"Acceso restringido",
			text:"Tienes que iniciar sesión para continuar",
			icon: "error",
			toast: true,
			position: "top-end",
			timer: 3000,
			showConfirmButton: false,
			background: "#fef2f2",
			color: "#991b1b",
		});
		return router.parseUrl("/login");
	}
};
