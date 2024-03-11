import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-team-image',
  templateUrl: './team-image.component.html',
  styleUrls: ['./team-image.component.scss']
})
export class TeamImageComponent {

  constructor(private http: HttpClient, private active: ActivatedRoute, private route: Router) {}

  displayedImage: string | ArrayBuffer | null = 'https://i.pinimg.com/originals/35/3d/7a/353d7a34da6baa266f4557b8181cb33c.jpg';
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    console.log(event);
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.displayedImage = reader.result;
      };
      this.selectedFile = fileInput.files[0];
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit() {
    let teamId = this.active.snapshot.params['teamId'];
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('teamAvatar', this.selectedFile, this.selectedFile.name);
      let _id=teamId
      this.http.patch(`${environment.baseUrl}teamImageUpdate/${_id}`, formData).subscribe(
        (res:any) => {
          console.log('File upload response:', res);
          if(res.message=='Update successful'){

              this.route.navigate(['/','home']);

          }
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.error('No file selected.');
    }
  }
}
