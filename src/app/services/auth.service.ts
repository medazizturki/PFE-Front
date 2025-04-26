import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  verifyFace(verifyRequest: { username: string, faceDescriptor: number[] }): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${this.baseUrl}/verify-face`, verifyRequest);
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

  logout(userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post(`${this.baseUrl}/logout`, null, { params, responseType: 'text' });
  }

  getLoggedInUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}