import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authservice: AuthService) {}

  canActivate(): boolean {
    console.log('Checking authentication status...');
    if (this.authservice.isLoggedIn()) {
      console.log('User is authenticated.');
      return true;
    } else {
      console.log('User is not authenticated. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
