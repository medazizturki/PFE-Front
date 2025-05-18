// src/app/services/taux-charge.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TauxChargeService {
  private baseUrl = 'http://localhost:8084/TauxCharge';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/all`);
  }


  add(taux: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, taux);
  }

  update(id: number, taux: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, taux);
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
