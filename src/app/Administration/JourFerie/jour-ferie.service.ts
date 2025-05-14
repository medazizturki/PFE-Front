import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JourFerieService {
  private baseUrl = 'http://localhost:8084/JourFerie'; // Update port if needed

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(jour: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, jour);
  }

  update(id: number, jour: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, jour);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

    logout(userId: string): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      return this.http.post(`${this.baseUrl}/logout`, null, { params, responseType: 'text' });
    }
}
