import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: '',
    adresse: '',
    sex: '',
    phone: '',
    verified: false
  };
  users: any = null;



  constructor(private authService: AuthService, private router: Router) {}


  logout(): void {
    const userId = this.users?.sub;
    if (userId) {
      this.authService.logout(userId).subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('Logout failed:', err);
        }
      });
    } else {
      console.warn('No user ID found for logout');
    }
  }
}
