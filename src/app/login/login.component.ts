// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  onLogin(disabledAccountModal?: any) {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed', error);
        
        if (error.message === 'ACCOUNT_DISABLED') {
          this.modalService.open(disabledAccountModal, { centered: true });
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again';
        }
      }
    });
  }
}