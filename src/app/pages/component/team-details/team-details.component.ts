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
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
interface TeamProfile {
  email: string;
  userName: string;
  companyUnit: string;
  avatar: string;
  teamId: string;
  gameLeader: boolean;
}
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent implements OnInit {
  detailsimage: string = `${environment.baseUrl}/images/`;
  defalutimage: string = '../../assets/images.png';
  TeamProfile: TeamProfile | null = null;
  teamProfileForm!: FormGroup;
  link = environment.baseUrl;
  isEditMode = false;
  tableData!: TeamProfile[];
  teamName: string = '';
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private team: TeamService,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private dashboardService: DashboardService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.getUserDetails();
    this.getTeamImages();
   

    this.http;

    this.userService.getUserPlayer().subscribe(
      (data: any) => {
        console.log('data0', data);
        
        this.tableData  = data.data;

        this.sortTeamProfiles();
      },
      (error: any) => {
        console.error('An error occurred:', error);
        // Handle error here
      }
    );
  }

  //  sortTeamProfilesByGameLeader(teamProfiles: TeamProfile[]): TeamProfile[] {
  //   return teamProfiles.sort((a, b) => {
  //     if (a.gameLeader && !b.gameLeader) {
  //       return -1; // a comes first
  //     } else if (!a.gameLeader && b.gameLeader) {
  //       return 1; // b comes first
  //     } else {
  //     }
  //   });
  // }

  initForm(): void {
    this.teamProfileForm = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.email],
      gameLeadername: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      displayedImage: [{ value: '' }],
    });
  }

    

  getUserDetails() {
    // const token = localStorage.getItem('token');
    this.userService.getProfileDetails().subscribe((response: any) => {
      // console.log('demo',data)

      this.TeamProfile = response.data;
      // TeamName: response.data?.teamId?.name
      console.log('res', response.data?.teamId?.name);

      this.teamName = response.data?.teamId?.name;

      this.teamProfileForm.patchValue({ email: response.data.email });
      // this.sortPeople();
      
      this.populateForm();
      this.sortTeamProfiles();
    });
  }
  
  sortTeamProfiles() {
    this.tableData = this.sortTeamProfilesByGameLeader(this.tableData);
  }

  sortTeamProfilesByGameLeader(teamProfiles: TeamProfile[]): TeamProfile[] {
    return teamProfiles.sort((a, b) => {
      if (a.gameLeader && !b.gameLeader) { 
        return -1; // a comes first
      } else if (!a.gameLeader && b.gameLeader) {
        return 1; // b comes first
      } else {
        return 0; // no change in order
      }
    });
  }
 

  populateForm(): void {
    if (this.TeamProfile) {
      this.teamProfileForm.patchValue({
        name: (this.TeamProfile.teamId as unknown as { [key: string]: string })[
          'name'
        ],
        // displayedImage: this.TeamProfile.avatar as unknown as {
        //   [key: string]: string;
        // }['avatar'],
      });
    }
    // this.displayedImage = this.teamProfileForm.get('displayedImage')?.value;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      // this.userProfileForm.enable();
    } else {
      console.log('elselllllllllllllllllll');
      this.teamProfileForm.disable();
      if (this.selectedFile) {
        const formData = new FormData();
        if (this.selectedFile) {
          formData.append('avatar', this.selectedFile);
          this.team.updateTeamImage(formData).subscribe((res: any) => {
            if (res.statusCode == 200) {
              console.log('ressssssssssss', res);
              // localStorage.setItem('avatar', res.data?.avatar);
              console.log('Image updated successfully');
              this.tostr.success('Image updated successfully');
            } else {
              this.tostr.error('failed');
            }
          });
        }
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

  getTeamImages() {
    this.dashboardService.getTeamImages().subscribe({
      next: (res: any) => {
        console.log('api res', res);
        // this.teamAImage = res.data?.avatar?`${environment.baseUrl}images/${res.data.avatar}`:this.teamBImage;
        this.displayedImage = res.data?.avatar;
      },
      error: (err: HttpErrorResponse) => {
        console.log('api error ', err);
      },
    });
  }



  
}
