// ✅ commision-hors-elec.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommisionHorsElecService {
  private baseUrl = 'http://localhost:8084/rushorselec';

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
}