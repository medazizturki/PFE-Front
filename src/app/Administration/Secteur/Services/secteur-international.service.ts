// secteur-international.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecteurInternationalService {
  private baseUrl = 'http://localhost:8084/secteurinternational';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(item: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, item);
  }

  update(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, item);
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