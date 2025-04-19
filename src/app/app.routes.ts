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
	{ path: "**", component: HomeComponent },
];
