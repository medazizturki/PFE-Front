import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class UserComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  error: string = '';
  user: any = null;
  signupForm: FormGroup;
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
  displayModal: boolean = false;

  sexeOptions = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      adresse: ['', Validators.required],
      sexe: ['', Validators.required]
    });
  }

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

  openSignupModal() {
    this.displayModal = true;
  }

  closeModal(): void {
    this.displayModal = false;
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
  

  confirmAddUser(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to add this user?',
      header: 'Confirmation',
      accept: () => {
        this.onSignup();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'User not added' });
      }
    });
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.newUser = { ...this.newUser, ...this.signupForm.value };
      this.userService.registerUser(this.newUser).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Utilisateur ajouté avec succès'
          });
          this.fetchUsers();
          this.closeModal();
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Un problème est survenu lors de l\'ajout'
          });
          this.loading = false;
          this.closeModal();
        }
      });
    }
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
    this.signupForm.reset();
    this.selectedImage = null;
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé' });
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'utilisateur :', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
      }
    });
  }
  

  disableUser(userId: string): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir désactiver cet utilisateur ?',
      header: 'Confirmation',
      accept: () => {
        this.userService.disableUser(userId).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Utilisateur désactivé avec succès'
            });
            this.fetchUsers();
          },
          error: (err) => {
            console.error('Erreur lors de la désactivation de l\'utilisateur:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Un problème est survenu lors de la désactivation'
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Annulé',
          detail: 'Action de désactivation annulée'
        });
      }
    });
  }
  
  enableUser(userId: string): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir activer cet utilisateur ?',
      header: 'Confirmation',
      accept: () => {
        this.userService.enableUser(userId).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Utilisateur activé avec succès'
            });
            this.fetchUsers();
          },
          error: (err) => {
            console.error('Erreur lors de l\'activation de l\'utilisateur:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Un problème est survenu lors de l\'activation'
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Annulé',
          detail: 'Action d\'activation annulée'
        });
      }
    });
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

  confirmDelete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirmation',
      accept: () => {
        this.deleteUser(userId);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'User not deleted' });
      }
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Action confirmed' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Action rejected' });
      }
    });
  }
}
