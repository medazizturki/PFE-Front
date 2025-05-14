// src/app/services/devises.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevisesService {
  private baseUrl = 'http://localhost:8084/devises';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(devises: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, devises);
  }

  update(id: number, devises: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, devises);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text' as 'json'
    });
  }
}
