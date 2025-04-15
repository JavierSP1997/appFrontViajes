import type { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	//logica del interceptor
	// req representa la peticion del servicio hacia nuestra api.
	console.log("PASO POR EL INTERCEPTOR");
	const cloneRequest = req.clone({
		setHeaders: {
			Authorization: localStorage.getItem("token") || "",
		},
	});
	return next(cloneRequest);
};
