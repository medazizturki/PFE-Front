// ✅ Angular service for TypeMarche
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypemarcheService {
  private baseUrl = 'http://localhost:8084/typemarche';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(typeMarche: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, typeMarche);
  }

  update(id: number, typeMarche: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, typeMarche);
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