import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule, RouterModule, MatToolbarModule, MatButtonModule,MatMenuModule, MatMenuTrigger,MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('recipe-sharing-platform');
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => console.log('Logged out'),
      error: (err) => console.error('Logout error:', err)
    });
  }
}
