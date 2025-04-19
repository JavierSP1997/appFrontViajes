import { computed, Injectable, signal } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class AuthServiceService {
	private _isAuthenticated = signal<boolean>(!!localStorage.getItem("token"));

	readonly isAuthenticated = computed(() => this._isAuthenticated());

	login(token: string) {
		localStorage.setItem("token", token);
		this._isAuthenticated.set(true);
	}

	logout() {
		localStorage.removeItem("token");
		this._isAuthenticated.set(false);
	}
}
