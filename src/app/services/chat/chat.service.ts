import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private videoUrl = `${environment.baseUrl}chat/stream/1717404711325-getting-started-03-angular-versions.mp4`
  // http://localhost:3000/chat/stream/1717404711325-getting-started-03-angular-versions.mp4

  constructor(private http: HttpClient) { }

  getVideoChunk(range: string) {
    const headers = new HttpHeaders().set('range', range);
    return this.http.get(this.videoUrl, { headers, responseType: 'blob' });
  }
}
