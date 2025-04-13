import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  
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

  }
}
