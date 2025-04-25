import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/v1/auth';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }



  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`);
  }

  deleteUser(userId: string): Observable<string> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`, { responseType: 'text' });
  }

  disableUser(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/disable/${userId}`, null, { responseType: 'text' });
  }

  enableUser(userId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enable/${userId}`, null, { responseType: 'text' });
  }

}