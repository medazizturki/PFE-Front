import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NatureReferentielsService {
  private readonly api = 'http://localhost:8084/naturereferentiels';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/all`);
  }

  add(item: any): Observable<any> {
    return this.http.post<any>(`${this.api}/add`, item);
  }

  update(id: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.api}/update/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/delete/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  
  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.api}/pdf`, {
      responseType: 'blob'
    });
  }

}
