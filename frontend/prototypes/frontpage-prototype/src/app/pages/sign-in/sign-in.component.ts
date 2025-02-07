import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  imports: [CommonModule, MATERIAL_IMPORTS, FormsModule]
})
export class SignInComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }
}


