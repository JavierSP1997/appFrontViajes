import type { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map, catchError, of, from } from "rxjs";
import type { UsuariosService } from "../services/usuarios.service";

export function emailExisteValidator(
	usuariosService: UsuariosService,
): AsyncValidatorFn {
	return (control: AbstractControl) => {
		return from(usuariosService.emailExiste(control.value)).pipe(
			map((existe) => (existe ? { emailExiste: true } : null)),
			catchError(() => of(null)),
		);
	};
}
