import { inject } from "@angular/core";
import { type CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const token = localStorage.getItem("token");

	if (token) {
		return true;
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		return router.parseUrl("/login");
	}
};
