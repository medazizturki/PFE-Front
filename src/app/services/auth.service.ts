import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private faceRecognitionUrl = 'http://localhost:8081/api/face-recognition';
  private baseUrl = 'http://localhost:8081/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(loginRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginRequest).pipe(
      catchError(error => {
        if (error.status === 401 && error.error?.error_description?.includes('disabled')) {
          return throwError(() => new Error('ACCOUNT_DISABLED'));
        }
        return throwError(() => error);
      }),
      tap(response => {
        localStorage.setItem('token', JSON.stringify(response));
      }),
      switchMap(() => this.getUserInfo())
    );
  }



  getUserInfo(): Observable<any> {
    const token = JSON.parse(localStorage.getItem('token') || '{}').access_token;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/user/info`, { headers }).pipe(
      tap(userInfo => {
        localStorage.setItem('user', JSON.stringify(userInfo));
      })
    );
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userId}/role`, { role });
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${user.userId}`, user, { responseType: 'text' });
  }

  logout(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post(`${this.baseUrl}/logout`, null, { params, responseType: 'text' });
  }

  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }


  faceLogin(descriptor: number[]): Observable<any> {
    return this.http.post(`${this.faceRecognitionUrl}/login`, { descriptor }).pipe(
      tap((response: any) => {
        if (response.success) {
          // Store token and user ID
          localStorage.setItem('token', response.token);
          localStorage.setItem('sub', response.id);
  
          // Prepare user info
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
            attributes: response.attributes
          };
  
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }
  
    isLoggedIn(): boolean {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      return token != null;
    }
    
}
