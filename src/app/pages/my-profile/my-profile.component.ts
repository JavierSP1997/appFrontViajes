import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  
  perfilUsuarioForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('', [
      Validators.required
    ]),
    gender: new FormControl('', [
      Validators.required
    ]),
    hobbies: new FormControl('', [
      Validators.required
    ]),
    pets: new FormControl('', [
      Validators.required
    ]),
    photo: new FormControl('', [
      Validators.required
    ]),
  })
  
  
  onSubmit() {
    if (this.perfilUsuarioForm.valid) {
      console.log('Formulario enviado correctamente')
    }

  }
}
