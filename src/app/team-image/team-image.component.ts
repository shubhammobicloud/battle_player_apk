import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService } from '../services/team/team.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../services/users/users.service';
@Component({
  selector: 'app-team-image',
  templateUrl: './team-image.component.html',
  styleUrls: ['./team-image.component.scss'],
})
export class TeamImageComponent {
  constructor(
    private userService: UserService,
    private route: Router,
    private teamService: TeamService,
    public translate:TranslateService
  ) {
    let lang:any=localStorage.getItem('lang')
    translate.use(lang);
  }

  displayedImage: string | ArrayBuffer | null =
    'https://i.pinimg.com/originals/35/3d/7a/353d7a34da6baa266f4557b8181cb33c.jpg';
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    // Reads the file that is being uploaded
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
    // upload the selected image..
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile, this.selectedFile.name);
      this.teamService.updateTeamImage(formData).subscribe(
        (res: any) => {
          console.log('File upload response:', res);
          if (res.success) {
            this.userService.sendMailToPlayers().subscribe(res=>{
              console.log(res)
            });
            this.route.navigate(['/', 'home']);
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
