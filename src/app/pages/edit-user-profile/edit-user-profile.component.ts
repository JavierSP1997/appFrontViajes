import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-profile.component.html',
  styleUrl: './edit-user-profile.component.css'
})
export class EditUserProfileComponent {
  
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
