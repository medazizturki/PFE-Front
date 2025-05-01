import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  logout(): void {
    const userId = this.user?.sub || this.user?.id || this.user?.attributes?.sub?.[0];
    if (userId) {
      this.authService.logout(userId).subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Logout failed:', err);
        }
      });
    } else {
      console.warn('No user ID found for logout');
    }
  }

  loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      console.log('User loaded:', this.user);
      console.log('User attributes:', this.user.attributes || 'No attributes found');
      console.log('Image path:', this.getUserImagePath());
    } else {
      console.warn('No user found in localStorage');
      // Optionally redirect to login if no user is found
      this.router.navigate(['/login']);
    }
  }

  getUserImagePath(): string {
    if (!this.user) return '';

    // Check for image in different possible locations
    if (this.user.image) {
      return `/assets/uploads-images/${this.user.image}`;
    }
    if (this.user.attributes?.image?.[0]) {
      return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    }
    if (this.user.attributes?.picture) {
      return `/assets/uploads-images/${this.user.attributes.picture}`;
    }
    return ''; // Fallback to empty string if no image is found
  }
}