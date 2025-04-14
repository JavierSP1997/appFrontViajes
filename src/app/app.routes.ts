import type { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
// import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { EditUserProfileComponent } from "./pages/edit-user-profile/edit-user-profile.component";
import { RegisterComponent } from "./pages/register/register.component";
import { MyProfileComponent } from "./pages/my-profile/my-profile.component";
import { ViajesComponent } from './pages/viajes/viajes.component';
import { Component } from "@angular/core";


export const routes: Routes = [
	{ path: "", pathMatch: "full", component: HomeComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "login", component: LoginComponent },
  { path: 'viajes', component: ViajesComponent },
	{ path: "perfil-usuario:id",  component: MyProfileComponent },
  { path: "perfil-usuario:id/editar", component: EditUserProfileComponent },
	{ path: "**", component: HomeComponent }
];
