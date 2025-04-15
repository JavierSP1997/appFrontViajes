import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
// import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css'
})
export class EditUserProfileComponent {
  
  usuariosService = inject(UsuariosService);
  perfilUsuarioForm: FormGroup = new FormGroup({
    name: new FormControl('Pepita', [
    ]),
    email: new FormControl('', [

    ]),
    password: new FormControl('', [

    ]),
    description: new FormControl('', [

    ]),
    gender: new FormControl('', [

    ]),
    hobbies: new FormControl('baloncesto', [

    ]),
    pets: new FormControl('true', [

    ]),
    photo: new FormControl('', [

    ]),
  })
  
  
  onSubmit() {
    if (this.perfilUsuarioForm.valid) {
      const formData = {
        nombre: this.perfilUsuarioForm.value.name,
        email: this.perfilUsuarioForm.value.email,
        password: this.perfilUsuarioForm.value.password,
        descripcion: this.perfilUsuarioForm.value.description,
        gender: this.perfilUsuarioForm.value.gender,
        hobbies: this.perfilUsuarioForm.value.hobbies,
        pets: this.perfilUsuarioForm.value.pets,
        imagen: this.perfilUsuarioForm.value.photo 
      };
  
  //     this.usuariosService.update(this.usuarioId, formData).then(() => {
      
  //     });
  //   }
  // }
  // ngOnInit() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decoded: any = jwt_decode(token);
  //     this.usuarioId = decoded.id;
  //   }
  // }
  
    }}}