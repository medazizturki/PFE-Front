import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupesService {
  private baseUrl = 'http://localhost:8084/groupes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  add(g: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, g);
  }

  update(id: number, g: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, g);
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
