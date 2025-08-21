import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  loginEmail = '';
  loginPassword = '';
  signupEmail = '';
  signupPassword = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => (this.errorMessage = err.message)
    });
  }

  signup() {
    this.authService.signup(this.signupEmail, this.signupPassword).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => (this.errorMessage = err.message)
    });
  }
}