// ✅ 1. Angular service for consuming TypeTeneur API
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeTeneurService {
  private baseUrl = 'http://localhost:8084/typeteneur';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(typeTeneur: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, typeTeneur);
  }

  update(id: number, typeTeneur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, typeTeneur);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text' as 'json' 
    });
  }


  logout(userId: string): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      return this.http.post(`${this.baseUrl}/logout`, null, { params, responseType: 'text' });
    }
}
