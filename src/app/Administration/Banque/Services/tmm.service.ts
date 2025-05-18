// src/app/services/tmm.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TMMService {
  private baseUrl = 'http://localhost:8084/tmm';

  constructor(private http: HttpClient) {}

  getAllTMM(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  addTMM(tmm: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, tmm);
  }

  updateTMM(id: number, tmm: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, tmm);
  }

  deleteTMM(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text' as 'json' 
    });
  }

    logout(userId: string): Observable<any> {
      const params = new HttpParams().set('userId', userId);
      return this.http.post(`${this.baseUrl}/logout`, null, { params, responseType: 'text' });
    }

  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf`, {
      responseType: 'blob'
    });
  }
}
