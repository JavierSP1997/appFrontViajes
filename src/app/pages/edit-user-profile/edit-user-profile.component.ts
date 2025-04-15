import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

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

  }
  async ngOnInit() {}
  }
  
