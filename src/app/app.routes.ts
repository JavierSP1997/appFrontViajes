import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from "./pages/login/login.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { EditUserProfileComponent } from './pages/edit-user-profile/edit-user-profile.component';

export const routes: Routes = [
    {path: '', pathMatch: 'full', component: HomeComponent},
    { path: "login", component: LoginComponent },
    {path: 'perfil-usuario', component: UserProfileComponent,
        children: [
            {path: 'editar', component: EditUserProfileComponent}] },
    {path: "**", redirectTo: "login"}
];
