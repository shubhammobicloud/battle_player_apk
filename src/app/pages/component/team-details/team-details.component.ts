import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatMenuTrigger } from '@angular/material/menu';
interface TeamProfile {
  userName: string;
  companyUnit: number;
  avatar: string;
  teamId: string;
  gameLeadername:string;
  gameLeader: boolean;
}
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent implements OnInit {
  TeamProfile: TeamProfile | null = null;
  teamProfileForm!: FormGroup;
  link = environment.baseUrl;
  isEditMode = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder,
    private tostr: ToastrService
  ) {}
  ngOnInit() {
    this.getUserDetails();
    this.initForm();
  }

  initForm(): void {
    this.teamProfileForm = this.fb.group({
      gameLeadername:[{value:'', disabled:true}],
      companyUnit: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      displayedImage: [{ value: '' }],
    });
  }
  getUserDetails() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userId = localStorage.getItem('userId'); // Assuming authentication
    this.http
      .get<TeamProfile>(`${environment.baseUrl}` + '', { headers })

      .subscribe((response: any) => {
        this.TeamProfile = response.data;
        this.http
          .get<TeamProfile>(
            environment.baseUrl + 'getTeam/' + response.data.teamId
          )
          .subscribe((res: any) => {
            console.log(res.data.teamId.name);
            // this.teamName = res.data.teamId.name;
          });
        this.populateForm();
      });
  }

  populateForm(): void {
    if (this.TeamProfile) {
      this.teamProfileForm.patchValue({
        companyUnit: this.TeamProfile.companyUnit,
        name: (this.TeamProfile.teamId as unknown as { [key: string]: string })[
          'name'
        ],
        displayedImage: (
          this.TeamProfile.teamId as unknown as {
            [key: string]: string;
          }
        )['avatar'],
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      // this.userProfileForm.enable();
    } else {
      this.teamProfileForm.disable();
      if (
        this.teamProfileForm.value.companyUnit !==
          this.TeamProfile?.companyUnit ||
        this.selectedFile
      ) {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        // console.log(headers);
        this.http
          .patch<TeamProfile>(
            // `${environment.baseUrl}` + '',
            this.teamProfileForm.value,
            { headers }
          )
          .subscribe(
            (res: any) => {
              this.TeamProfile = res.data.teamId;
              this.tostr.success('Profile Updated Successfully');
              const formData = new FormData();
              if (this.selectedFile) {
                formData.append('avatar', this.selectedFile);
                this.http
                  .patch(
                    `${environment.baseUrl}` + ' ' + userId,
                    formData,
                    { headers }
                  )
                  // /images/'
                  .subscribe((res: any) => {
                    this.displayedImage = res.userProfile.teamId.avatar;
                    console.log(this.displayedImage);
                    console.log('image saved successfully');
                  });
              }
            },
            (error: HttpErrorResponse) => {
              console.error('error while updating');
            }
          );
      }
    }
  }

  selectedFile: File | null = null;
  displayedImage: string | ArrayBuffer | null =
    'https://www.w3schools.com/howto/img_avatar.png';

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        this.displayedImage = reader.result as string;
      };
      this.selectedFile = fileInput.files[0];
      console.log(this.selectedFile);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  tableHeader = ['Player Name'];
  myTeamList = [
    { name: 'Player 1', gameLeaderName: 'Demo' , imag:'../../assets/Max-R_Headshot (1).jpg' },
    { name: 'Player 2', gameLeaderName: 'Demo' ,imag:'../../assets/Max-R_Headshot (1).jpg'},
    { name: 'Player 3', gameLeaderName: 'Demo' ,imag:'/assets/Max-R_Headshot (1).jpg'},
  ];
}
