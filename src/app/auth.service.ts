import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user ,onAuthStateChanged } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signup(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getUser(): Observable<any> {
    return user(this.auth);
  }

  isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map(user => !!user));
  }
  getCurrentUser(): Observable<{ uid: string } | null> {
    return new Observable(observer => {
      onAuthStateChanged(this.auth, user => {
        observer.next(user ? { uid: user.uid } : null);
        observer.complete();
      });
    });
  }
}