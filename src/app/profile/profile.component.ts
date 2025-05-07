import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

declare var faceapi: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('photoElement') photoElement!: ElementRef;

  user: any = {};
  isUpdating: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedImage: string | ArrayBuffer | null = null;

  isCameraOn: boolean = false;
  faceData: any = null;
  faceStatus: { message: string, type: string } | null = null;
  private stream: MediaStream | null = null;
  private modelsLoaded = false;
  displayModalFaceUpdate: boolean = false;

  errors: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadFaceAPIModels();
  }

  openFaceModal() {
    this.displayModalFaceUpdate = true;
    this.loadFaceAPIModels();
  }

  closeFaceModal(): void {
    this.displayModalFaceUpdate = false;
    this.stopCamera();
  }

  async loadFaceAPIModels() {
    try {
      this.showFaceStatus('Loading face recognition models...', 'info');

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models/tiny_face_detector_model-weights_manifest.json'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models/face_landmark_68_model-weights_manifest.json'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models/face_recognition_model-weights_manifest.json')
      ]);

      this.modelsLoaded = true;
      this.showFaceStatus('Face recognition ready!', 'success');
      setTimeout(() => this.faceStatus = null, 2000);
    } catch (error) {
      console.error('Error loading models:', error);
      this.showFaceStatus('Error loading face recognition. Please refresh.', 'error');
    }
  }

  async startCamera() {
    if (!this.modelsLoaded) {
      this.showFaceStatus('Models not loaded yet', 'error');
      return;
    }

    try {
      this.showFaceStatus('Starting camera...', 'info');

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 320,
          height: 240,
          facingMode: 'user'
        }
      });

      this.videoElement.nativeElement.srcObject = this.stream;
      await this.videoElement.nativeElement.play();

      this.videoElement.nativeElement.style.display = 'block';
      this.canvasElement.nativeElement.style.display = 'none';
      this.photoElement.nativeElement.style.display = 'none';

      this.isCameraOn = true;
      this.showFaceStatus('Camera started. Position your face in the frame.', 'success');
    } catch (error) {
      console.error('Camera error:', error);
      this.showFaceStatus(`Camera error: ${(error as Error).message}`, 'error');
    }
  }

  async captureFace() {
    if (!this.stream) {
      this.showFaceStatus('Please start the camera first', 'error');
      return;
    }

    try {
      this.showFaceStatus('Detecting face...', 'info');

      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const photo = this.photoElement.nativeElement;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 })
      ).withFaceLandmarks().withFaceDescriptors();

      if (detections.length === 0) {
        this.showFaceStatus('No face detected. Please try again.', 'error');
        return;
      }

      if (detections.length > 1) {
        this.showFaceStatus('Multiple faces detected. Please ensure only one face is visible.', 'error');
        return;
      }

      const descriptor = Array.from(detections[0].descriptor);
      const imageData = canvas.toDataURL('image/jpeg');

      this.faceData = {
        image: imageData,
        descriptor,
        timestamp: new Date().toISOString()
      };

      photo.src = imageData;
      video.style.display = 'none';
      photo.style.display = 'block';

      this.showFaceStatus('Face captured successfully!', 'success');
    } catch (error) {
      console.error('Face detection error:', error);
      this.showFaceStatus(`Error: ${(error as Error).message}`, 'error');
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.videoElement.nativeElement.srcObject = null;
    this.videoElement.nativeElement.style.display = 'none';
    this.isCameraOn = false;
    this.showFaceStatus('Camera stopped', 'info');
  }

  showFaceStatus(message: string, type: 'info' | 'success' | 'error') {
    this.faceStatus = { message, type };
  }

  getUserImagePath(): string {
    if (!this.user) return '';

    return this.user.image
      ? '/assets/uploads-images/' + this.user.image
      : this.user.attributes?.image?.[0]
      ? '/assets/uploads-images/' + this.user.attributes.image[0]
      : this.user.attributes?.picture
      ? '/assets/uploads-images/' + this.user.attributes.picture
      : '';
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

  updateUser() {
    const userId = this.user?.sub || this.user?.id || this.user?.attributes?.sub?.[0];
    if (!userId) {
      this.errorMessage = 'No user ID available for update';
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userToUpdate = {
      preferred_username: this.user.preferred_username ?? '',
      firstName: typeof this.user.firstName === 'string' ? this.user.firstName : '',
      lastName: typeof this.user.lastName === 'string' ? this.user.lastName : '',
      email: typeof this.user.email === 'string' ? this.user.email : '',
      image: typeof this.user.image === 'string' ? this.user.image : '',
      adresse: typeof this.user.adresse === 'string' ? this.user.adresse : '',
      sexe: typeof this.user.sexe === 'string' ? this.user.sexe : '',
      phone: typeof this.user.phone === 'string' ? this.user.phone : '',
      faceData: typeof this.user.faceData === 'string' ? this.user.faceData : '',
      userId: userId
    };

    this.authService.updateUser(userToUpdate).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.isUpdating = false;
        this.successMessage = 'Profile updated successfully!';
        const updatedUser = { ...this.user, ...userToUpdate };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (error) => {
        console.error('Failed to update user', error);
        this.isUpdating = false;
        this.errors = error.error?.errors || {}; // Assuming backend returns field-specific errors
        setTimeout(() => (this.errors = {}), 5000);
      }
    });
  }

  onFileSelectedAjout(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.user.image = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadCurrentUser(): void {
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : {};
    console.log('Current user object:', this.user);
  }

  faceLogin() {
    if (!this.faceData) {
      this.showFaceStatus('No face data captured', 'error');
      return;
    }

    this.userService.faceLogin(this.faceData.descriptor).subscribe({
      next: (response) => {
        if (response.success) {
          this.showFaceStatus('Login successful!', 'success');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/home']);
        } else {
          this.showFaceStatus('Login failed: ' + response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Face login error:', error);
        this.showFaceStatus('Login error: ' + (error.error?.message || 'Unknown error'), 'error');
      }
    });
  }

  registerFace() {
    if (!this.faceData) {
      this.showFaceStatus('No face data captured', 'error');
      return;
    }

    const userId = this.user?.sub || this.user?.id || this.user?.attributes?.sub?.[0];
    if (!userId) {
      this.showFaceStatus('No user ID found. Please log in again.', 'error');
      return;
    }

    const truncatedDescriptor = this.faceData.descriptor.slice(0, 10);
    this.userService.registerFace(userId, truncatedDescriptor).subscribe({
      next: (response) => {
        if (response.success) {
          this.showFaceStatus('Face registered successfully!', 'success');
          this.user.faceData = this.faceData;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          this.showFaceStatus('Face registration failed: ' + response.message, 'error');
        }
      },
      error: (error) => {
        console.error('Face registration error:', error);
        this.showFaceStatus('Registration error: ' + (error.error?.message || 'Unknown error'), 'error');
      }
    });
  }
}
