import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  imports: [CommonModule, MATERIAL_IMPORTS, FormsModule],
  standalone: true
})
export class SignupComponent {;
  username: string = '';
  password: string = '';
  errorMess: string = '';

  constructor(private signupService: SignupService) {}

  onSubmit() {
    this.signupService.createUser(this.username, this.password)
      .subscribe(
        (response) => console.log('Account created successfully', response),
        (error) => {
          this.errorMess = 'Could not create account';
          console.error('Error creating account', error);
        }
      );
  }
}


