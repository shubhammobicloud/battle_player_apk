import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/users/users.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-player-image',
  templateUrl: './player-image.component.html',
  styleUrls: ['./player-image.component.scss'],
})
export class PlayerImageComponent {
  constructor(
    private http: HttpClient,
    private active: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private toastr:ToastrService,
    private userService:UserService
  ) {}

  displayedImage: string | ArrayBuffer | null =
    'https://www.w3schools.com/howto/img_avatar.png';
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
    let token = this.active.snapshot.params['token'];
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile, this.selectedFile.name);
      // formData.append('token', token);

     this.userService.updatePlayer(formData)
        .subscribe(
          (res: any) => {
            console.log('File upload response:', res);
            if (res.success) {
              this.toastr.success('Profile Image Updated Successfully!');
              if (res.data) {
                localStorage.setItem("avatar",res.data.avatar)
                this.route.navigate(['/', 'teamImage', token]);

              } else {

                this.route.navigate(['/', 'home']);
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
