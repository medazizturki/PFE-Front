import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntermediaireService {

private baseUrl = 'http://localhost:8084/intermediaire'; // adapte le port si besoin

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, { 
      responseType: 'text' as 'json' 
    });
  }


  downloadPdf(): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/pdf`, {
    responseType: 'blob'
  });
  }
}
