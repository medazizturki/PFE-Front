import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  @ViewChild('faceVideo') faceVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('faceCanvas') faceCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('facePhoto') facePhoto!: ElementRef<HTMLImageElement>;

  loginRequest = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  showFaceLogin = false;
  isFaceCameraOn = false;
  faceLoginStatus: { message: string, type: string } | null = null;
  private faceStream: MediaStream | null = null;
  private faceModelsLoaded = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnDestroy(): void {
    //this.stopFaceCamera();
  }

  onLogin(disabledAccountModal?: any) {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login successful', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed', error);
  
        if (error.message === 'ACCOUNT_DISABLED') {
          this.modalService.open(disabledAccountModal, { centered: true });
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      }
    });
  }
  

  toggleFaceLogin() {
    this.showFaceLogin = !this.showFaceLogin;
    if (this.showFaceLogin) {
      this.loadFaceModels();
    } else {
      this.stopFaceCamera();
    }
  }

  async loadFaceModels() {
    try {
      this.showFaceStatus('Loading face recognition models...', 'info');

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models')
      ]);

      this.faceModelsLoaded = true;
      this.showFaceStatus('Face recognition ready!', 'success');
      setTimeout(() => this.faceLoginStatus = null, 2000);
    } catch (error) {
      console.error('Error loading models:', error);
      this.showFaceStatus('Error loading face recognition. Please refresh.', 'error');
    }
  }

  async startFaceCamera() {
    if (!this.faceModelsLoaded) {
      this.showFaceStatus('Models not loaded yet', 'error');
      return;
    }

    try {
      this.showFaceStatus('Starting camera...', 'info');

      if (this.faceStream) {
        this.faceStream.getTracks().forEach(track => track.stop());
      }

      this.faceStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 320,
          height: 240,
          facingMode: 'user'
        }
      });

      this.faceVideo.nativeElement.srcObject = this.faceStream;
      await this.faceVideo.nativeElement.play();

      this.faceVideo.nativeElement.style.display = 'block';
      this.faceCanvas.nativeElement.style.display = 'none';
      this.facePhoto.nativeElement.style.display = 'none';

      this.isFaceCameraOn = true;
      this.showFaceStatus('Camera started. Position your face in the frame.', 'success');
    } catch (error) {
      console.error('Camera error:', error);
      this.showFaceStatus(`Camera error: ${(error as Error).message}`, 'error');
    }
  }
    

  async recognizeFace() {
    if (!this.faceStream) {
        this.showFaceStatus('Please start the camera first', 'error');
        return;
    }

    try {
        this.showFaceStatus('Recognizing face...', 'info');

        const video = this.faceVideo.nativeElement;
        const canvas = this.faceCanvas.nativeElement;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        const detections = await faceapi.detectAllFaces(
            canvas,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptors();

        if (detections.length === 0) {
            this.showFaceStatus('No face detected. Please try again.', 'error');
            return;
        }

        // Truncate the descriptor to the first 10 elements
        const descriptor = Array.from(detections[0].descriptor).slice(0, 10);

        this.showFaceStatus('Verifying identity...', 'info');

        this.authService.faceLogin(descriptor).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.showFaceStatus('Login successful! Redirecting...', 'success');
              localStorage.setItem('token', response.token);
              localStorage.setItem('sub', response.id);
      
              // Store user information in local storage
              const user = {
                id: response.id,
                preferred_username: response.username,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
                image: response.image || response.attributes?.image?.[0],
                adresse: response.adresse || response.attributes?.adresse?.[0],
                sexe: response.sexe || response.attributes?.sexe?.[0],
                phone: response.phone || response.attributes?.phone?.[0],
                faceData: response.faceData || response.attributes?.faceDescriptor?.[0],
                attributes: response.attributes // Include the full attributes object
              };
              localStorage.setItem('user', JSON.stringify(user));
      
              // Stop the camera
              this.stopFaceCamera();
      
              this.router.navigate(['/home']);
            } else {
              this.showFaceStatus(response.message || 'Face not recognized', 'error');
            }
          },
          error: (error) => {
            console.error('Face login error:', error);
            this.showFaceStatus(error.error?.message || 'Error during face recognition', 'error');
          }
        });
    } catch (error) {
        console.error('Face recognition error:', error);
        this.showFaceStatus(`Error: ${(error as Error).message}`, 'error');
    }
}



  stopFaceCamera() {
    if (this.faceStream) {
      this.faceStream.getTracks().forEach(track => track.stop());
      this.faceStream = null;
    }

    this.faceVideo.nativeElement.srcObject = null;
    this.faceVideo.nativeElement.style.display = 'none';
    this.isFaceCameraOn = false;
    this.showFaceStatus('Camera stopped', 'info');
  }

  showFaceStatus(message: string, type: 'info' | 'success' | 'error') {
    this.faceLoginStatus = { message, type };
  }
}
