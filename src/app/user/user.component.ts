import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  error: string = '';
  user: any = null;
  newUser: any = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: '',
    adresse: '',
    sexe: '',
    phone: ''
  };

  selectedImage: string | ArrayBuffer | null = null;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) { }


  
  ngOnInit(): void {
    this.fetchUsers();
    this.loadCurrentUser();
  }

loadCurrentUser(): void {
  const userStr = localStorage.getItem('user');
  this.user = userStr ? JSON.parse(userStr) : null;
  
  console.log('Current user object:', this.user);
  if (this.user) {
    console.log('User attributes:', this.user.attributes);
    console.log('Image path:', this.getUserImagePath());
  }
}

getUserImagePath(): string {
  if (!this.user) return '';
  
  // Try different possible locations for the image
  if (this.user.image) {
    return '/assets/uploads-images/' + this.user.image;
  }
  if (this.user.attributes?.image?.[0]) {
    return '/assets/uploads-images/' + this.user.attributes.image[0];
  }
  if (this.user.attributes?.picture) {
    return '/assets/uploads-images/' + this.user.attributes.picture;
  }
  return '';
}


  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        this.error = 'Impossible de charger les utilisateurs. Veuillez réessayer plus tard.';
        this.loading = false;
      }
    });
  }

  openSignupModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
  }


  onFileSelectedAjout(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        // Set the image name to newUser (not user)
        this.newUser.image = file.name;
        // For preview (optional)
        const reader = new FileReader();
        reader.onload = () => {
            this.selectedImage = reader.result;
        };
        reader.readAsDataURL(file);
    }
}

  
onSignup(): void {
  this.loading = true;
  this.userService.registerUser(this.newUser).subscribe({
    next: (response) => {
      this.fetchUsers();
      this.modalService.dismissAll(); // Close the modal
      this.resetForm();
      this.loading = false;
      // Navigate to the /users page
      this.router.navigate(['/users']);
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
      this.error = 'Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.';
      this.loading = false;
    }
  });
}



  resetForm(): void {
    this.newUser = {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      image: '',
      adresse: '',
      sexe: '',
      phone: ''
    };
  }

  deleteUser(userId: string): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      this.userService.deleteUser(userId).subscribe({
        next: (message) => {
          alert(message);
          this.fetchUsers();
        },
        error: (err) => {
          alert("Erreur lors de la suppression de l'utilisateur.");
        }
      });
    }
  }

  disableUser(userId: string): void {
    if (confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?")) {
      this.userService.disableUser(userId).subscribe({
        next: (message) => {
          alert(message);
          this.fetchUsers(); // Refresh the list
        },
        error: (err) => {
          alert("Erreur lors de la désactivation de l'utilisateur.");
          console.error('Disable user error:', err);
        }
      });
    }
  }

  enableUser(userId: string): void {
    if (confirm("Êtes-vous sûr de vouloir activer cet utilisateur ?")) {
      this.userService.enableUser(userId).subscribe({
        next: (message) => {
          alert(message);
          this.fetchUsers(); // Refresh the list
        },
        error: (err) => {
          alert("Erreur lors de l'activation de l'utilisateur.");
          console.error('Enable user error:', err);
        }
      });
    }
  }

  
  logout(): void {
    const userId = this.user?.sub;
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
}