import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';
import type { Usuario } from '../../../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css'
})
export class EditUserProfileComponent {
  usuarioId: number | null = null;
  usuarioOriginal: Usuario | null = null;
  usuariosService = inject(UsuariosService);
  private router = inject(Router);


  perfilUsuarioForm: FormGroup = new FormGroup({
    name: new FormControl('Pepita'),
    email: new FormControl(''),
    password: new FormControl(''),
    description: new FormControl(''),
    gender: new FormControl(''),
    hobbies: new FormControl('baloncesto'),
    pets: new FormControl('true'),
    photo: new FormControl(''),
  });
  async ngOnInit() {
    const usuario = await this.usuariosService.getPerfilUsuario();
    if (usuario) {
      this.usuarioId = usuario.id_usuario;
      this.usuarioOriginal = usuario;
      this.perfilUsuarioForm.setValue({
        name: usuario.nombre || '',
        email: usuario.email || '',
        password:'', 
        description: usuario.descripcion || '',
        gender: usuario.gender || '',
        hobbies: usuario.hobbies || '',
        pets: usuario.pets || false,
        imagen: usuario.imagen || '',
      });
    }}

  async onSubmit() {
    
  }

    cancelarEdicion() {
      this.router.navigate(['/perfil-usuario']);
    }

    onImagenSeleccionada(event: Event): void {
     
    }
  }