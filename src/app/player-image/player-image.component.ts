import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment/enviroment';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-player-image',
  templateUrl: './player-image.component.html',
  styleUrls: ['./player-image.component.scss']
})
export class PlayerImageComponent {
  constructor(private http: HttpClient, private active: ActivatedRoute, private route: Router, private authService:AuthService) {}

  displayedImage: string | ArrayBuffer | null = 'https://www.w3schools.com/howto/img_avatar.png';
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
    let _id = this.active.snapshot.params['_id'];
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile, this.selectedFile.name);

      this.http.patch(`${environment.baseUrl}playerImageUpdate/${_id}`, formData).subscribe(
        (res:any) => {
          console.log('File upload response:', res);
          if(res.message=='update successfully'){
            if(res.gameLeader){
              this.authService.gameLeader=true
              this.route.navigate(['/','teamImage',res.teamId]);
            }else{
              this.authService.gameLeader=false
              this.route.navigate(['/','home']);
            }
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
