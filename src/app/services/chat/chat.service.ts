import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/enviroment';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

  downloadMedia(name: string): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}chat/download/${name}`, {
      responseType: 'blob',
    });
  }

  async saveFileToFilesystem(name: string, blob: Blob): Promise<void> {
    try {
      const base64Data = await this.convertBlobToBase64(blob);
      const directory = Directory.Documents; // Use External directory for better visibility
      const path = `${name}`;

      // Write the file
      await Filesystem.writeFile({
        path,
        data: base64Data,
        directory,
      });

      // Verify file creation
      // console.log(`File saved successfully at ${path}`);
    } catch (error) {
      // console.error('Error saving file:', error);
      throw error;
    }
  }

  // private async ensureDirectoryExists(directory: string, baseDirectory: Directory) {
  //   try {
  //     await Filesystem.mkdir({
  //       path: directory,
  //       directory: baseDirectory,
  //       recursive: true, // Create intermediate directories
  //     });
  //   } catch (error:any) {
  //     if (error.message !== 'Current directory does already exist.') {
  //       console.error('Error creating directory:', error);
  //       throw error;
  //     }
  //   }
  // }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        // Remove the data URL prefix to store raw base64 data
        const base64Data = (reader.result as string).split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  }
}
