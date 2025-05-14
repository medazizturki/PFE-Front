// ✅ Angular service: compte-teneur.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompteTeneurService {
  private baseUrl = 'http://localhost:8084/compteteneur';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(compteTeneur: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, compteTeneur);
  }

  update(id: number, compteTeneur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, compteTeneur);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text' as 'json'
    });
  }
}
