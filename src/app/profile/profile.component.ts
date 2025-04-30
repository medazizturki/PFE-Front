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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadFaceAPIModels();
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
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.5
        })
      ).withFaceLandmarks().withFaceDescriptors();

      if (detections.length === 0) {
        this.showFaceStatus('No face detected. Please try again.', 'error');
        return;
      }

      if (detections.length > 1) {
        this.showFaceStatus('Multiple faces detected. Please ensure only one face is visible.', 'error');
        return;
      }

      // Get full descriptor
      const fullDescriptor = Array.from(detections[0].descriptor);
      console.log('Full face descriptor length:', fullDescriptor.length);
          
      // Use the full descriptor without truncating
      const descriptor = Array.from(detections[0].descriptor);
      console.log('Face descriptor length:', descriptor.length);

      const imageData = canvas.toDataURL('image/jpeg');

      this.faceData = {
        image: imageData,
        descriptor: descriptor, // Use full descriptor
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

  updateUser() {
      if (!this.user?.sub) {
        this.errorMessage = 'No user ID available for update';
        return;
      }

      this.isUpdating = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userToUpdate = {
        preferred_username: this.user.preferred_username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        image: this.user.image,
        adresse: this.user.adresse,
        sexe: this.user.sexe,
        phone: this.user.phone,
        userId: this.user.sub,
        faceData: this.user.faceData
      };

      this.authService.updateUser(userToUpdate).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.isUpdating = false;
          this.successMessage = response;

          const updatedUser = { ...this.user, ...userToUpdate };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Failed to update user', error);
          this.isUpdating = false;

          if (error.error instanceof ErrorEvent) {
            this.errorMessage = `Error: ${error.error.message}`;
          } else {
            this.errorMessage = error.error || error.message || 'Unknown error occurred';
          }

          setTimeout(() => this.errorMessage = '', 5000);
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
    if (this.user) {
      console.log('User attributes:', this.user.attributes);
      console.log('Image path:', this.getUserImagePath());
    }
  }
  faceLogin() {
    if (!this.faceData) {
      this.showFaceStatus('No face data captured', 'error');
      return;
    }

    console.log('Sending login descriptor with length:', this.faceData.descriptor.length);
    
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

    // Truncate the descriptor to the first 10 elements
    const truncatedDescriptor = this.faceData.descriptor.slice(0, 10);
    console.log('Sending registration descriptor with length:', truncatedDescriptor.length);

    this.userService.registerFace(this.user.sub, truncatedDescriptor).subscribe({
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
