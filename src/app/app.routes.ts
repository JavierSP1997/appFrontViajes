import type { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { EditUserProfileComponent } from "./pages/edit-user-profile/edit-user-profile.component";
import { RegisterComponent } from "./pages/register/register.component";
import { MyProfileComponent } from "./pages/my-profile/my-profile.component";
import { ViajesComponent } from "./pages/viajes/viajes.component";
import { authGuard } from "./guards/auth.guard";
import { TripComponent } from "./pages/trip/trip.component";
import { PublicProfileComponent } from "./pages/public-profile/public-profile.component";
import { PublicarViajeComponent } from "./pages/publicar-viaje/publicar-viaje.component";
import { MisViajesComponent } from "./pages/mis-viajes/mis-viajes.component";
import { EditViajeComponent } from "./pages/edit-viaje/edit-viaje.component";

export const routes: Routes = [
	{ path: "", pathMatch: "full", component: HomeComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "login", component: LoginComponent },
	{ path: "viajes", component: ViajesComponent },
	{
		path: "viajes/:idViaje",
		component: TripComponent,
		canActivate: [authGuard],
	},
	{
		path: 'viajes/:id/editar',
		component: EditViajeComponent,
	},
	{
		path: "perfil-usuario",
		component: MyProfileComponent,
		canActivate: [authGuard],
	},
	{
		path: "perfil-usuario/:id",
		component: PublicProfileComponent,
		canActivate: [authGuard],
	},
	{ path: "perfil-usuario/:id/editar", component: EditUserProfileComponent },
	{
		path: "publicar",
		component: PublicarViajeComponent,
		canActivate: [authGuard],
	},
	{ path: "mis-viajes", component: MisViajesComponent },
	{ path: "**", component: HomeComponent },
];
