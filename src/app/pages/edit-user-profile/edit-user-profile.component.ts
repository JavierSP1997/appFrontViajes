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
  imagenPreview: string | null = null;
  usuariosService = inject(UsuariosService);
  private router = inject(Router);
  mostrarPassword = false;

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
        photo: usuario.imagen || '',
      });
    }}

  async onSubmit() {
    if (this.perfilUsuarioForm.valid && this.usuarioId !== null && this.usuarioOriginal !== null) {
      const formData: Usuario = {
        id_usuario: this.usuarioId,
        nombre: this.perfilUsuarioForm.value.name,
        email: this.perfilUsuarioForm.value.email,
        password: this.perfilUsuarioForm.value.password,
        descripcion: this.perfilUsuarioForm.value.description,
        gender: this.perfilUsuarioForm.value.gender,
        hobbies: this.perfilUsuarioForm.value.hobbies,
        pets: this.perfilUsuarioForm.value.pets,
        imagen: this.perfilUsuarioForm.value.photo,
        fecha_registro: this.usuarioOriginal.fecha_registro,
      };
  
      await this.usuariosService.update(this.usuarioId, formData);

      this.router.navigate(['/perfil-usuario']); 
    }
  }

    cancelarEdicion() {
      this.router.navigate(['/perfil-usuario']);
    }

    onImagenSeleccionada(event: Event): void {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
        // Opcional: guardar archivo para enviarlo al backend
        // this.formulario.patchValue({ imagen: file });
      }
    }
  }