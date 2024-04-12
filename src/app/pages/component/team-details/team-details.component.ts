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
import { TeamService } from 'src/app/services/team/team.service';
import { UserService } from 'src/app/services/users/users.service';
interface TeamProfile {
  userName: string;
  name: string;
  companyUnit: number;
  avatar: string;
  teamId: string;
  gameLeadername: string;
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
  tableData!: any[];
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private fb: FormBuilder,
    private tostr: ToastrService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getUserDetails();

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any>(`${environment.baseUrl}user/player-list`, { headers })
      .subscribe(
        (data: any) => {
          this.tableData = data['data'];
        },
        (error: any) => {
          console.error('An error occurred:', error);
          // Handle error here
        }
      );
  }

  initForm(): void {
    this.teamProfileForm = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.email],
      gameLeadername: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      displayedImage: [{ value: '' }],
    });
  }

  getUserDetails() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http;
    this.userService.getProfileDetails().subscribe(
      (response: any) => {
        this.TeamProfile = response.data;
        this.populateForm();
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  populateForm(): void {
    if (this.TeamProfile) {
      this.teamProfileForm.patchValue({
        gameLeadername: (
          this.TeamProfile.teamId as unknown as { [key: string]: string }
        )['userName'],
        name: (this.TeamProfile.teamId as unknown as { [key: string]: string })[
          'name'
        ],
        displayedImage: this.TeamProfile.avatar as unknown as {
          [key: string]: string;
        }['avatar'],
      });
    }
    this.displayedImage = this.teamProfileForm.get('displayedImage')?.value;
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
                  .patch(`${environment.baseUrl}` + ' ' + userId, formData, {
                    headers,
                  })
                  // /images/'
                  .subscribe((res: any) => {
                    this.displayedImage = res.userProfile.teamId.avatar;
                    console.log(this.displayedImage);
                    console.log('Image saved successfully');
                  });
              }
            },
            (error: HttpErrorResponse) => {
              console.error('Error while updating');
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
  // tableHeader = ['Player Name'];
  // myTeamList = [
  //   {
  //     name: 'Player 1',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 2',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 3',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 4',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 5',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 6',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 7',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 8',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 9',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 10',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 11',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 12',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 1',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 2',
  //     gameLeaderName: 'Demo',
  //     imag: '../../assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 3',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 4',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 5',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  //   {
  //     name: 'Player 6',
  //     gameLeaderName: 'Demo',
  //     imag: '/assets/Max-R_Headshot (1).jpg',
  //   },
  // ];
}
