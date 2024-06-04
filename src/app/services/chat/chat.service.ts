import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private videoUrl = `${environment.baseUrl}chat/stream/1717404711325-getting-started-03-angular-versions.mp4`
  // http://localhost:3000/chat/stream/1717404711325-getting-started-03-angular-versions.mp4
  // <video _ngcontent-ng-c198133106="" width="560" height="315" controls="" src="http://192.168.29.234:3000/chat/stream/1717482301081-getting-started-02-what-is-angular.mp4"> Your browser does not support the video tag. </video>

  constructor(private http: HttpClient) { }

  // getVideoChunk() {
  //   // const headers = new HttpHeaders().set('ResRange', range);
  //   return this.http.get(this.videoUrl, { responseType: 'blob' });
  // }
  getVideoChunk(start: number = 0, end: number = 1000000): Observable<Blob> {
    const headers = new HttpHeaders({
      // 'Range': `bytes=${start}-${end}`
      // 'Authorization': 'Bearer your-token'  // Replace 'your-token' with the actual token
    });
    return this.http.get(this.videoUrl, {headers, responseType: 'blob' });
  }
}
