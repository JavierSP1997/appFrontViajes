import { Component, inject } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  usuariosService = inject(UsuariosService)
  router = inject(Router);

  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })


  async onSubmit() {
    console.log("Datos del formulario:", this.formLogin.value);
    if (this.formLogin.invalid) return;

    try {
      const response = await this.usuariosService.login(this.formLogin.value);
      localStorage.setItem('token', response.token); 
      alert('Login exitoso');
      this.router.navigate(['/']); 
    } catch (error) {
      alert('Error en usuario y/o password');
      console.error(error);
    }
  }
}
