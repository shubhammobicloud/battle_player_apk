import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  uploadMedia(selectedDoc: File) {
    let formData = new FormData();
    formData.append('file', selectedDoc);
    return this.http.post(`${environment.baseUrl}chat/upload`, formData);
  }

  downloadMedia(name: string) {
    return this.http.get(`${environment.baseUrl}chat/download/${name}`, {
      responseType: 'blob',
    });
  }
}
