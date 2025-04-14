import type { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { EditUserProfileComponent } from "./pages/edit-user-profile/edit-user-profile.component";
import { RegisterComponent } from "./pages/register/register.component";
import { MyProfileComponent } from "./pages/my-profile/my-profile.component";

export const routes: Routes = [
	{ path: "", pathMatch: "full", component: HomeComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "login", component: LoginComponent },
	{
		path: "perfil-usuario",
		component: UserProfileComponent,
		children: [
			{ path: ":id", component: MyProfileComponent },
			{ path: "editar:id", component: EditUserProfileComponent },
		],
	},
	{ path: "**", component: HomeComponent }
];
