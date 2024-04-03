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
interface UserProfile {
  email: string;
  userName: string;
  companyUnit: number;
  avatar: string;
  teamId: string;
  gameLeader: boolean;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  userProfileForm!: FormGroup;
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
    this.userProfileForm = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.email],
      companyUnit: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      displayedImage:[{value:'',}]
    });
  }
  getUserDetails() {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const userId = localStorage.getItem('userId'); // Assuming authentication
    this.http
      .get<UserProfile>(`${environment.baseUrl}` + '/user/details', { headers })

      .subscribe((response: any) => {
        this.userProfile = response.data;
        this.http
          .get<UserProfile>(
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
    if (this.userProfile) {
      this.userProfileForm.patchValue({
        email: this.userProfile.email,
        companyUnit: this.userProfile.companyUnit,
        name: (this.userProfile.teamId as unknown as { [key: string]: string })[
          'name'
        ],
        displayedImage:this.userProfile.teamId as unknown as {[key:string]:string}['avatar']
      });
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      // this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
      if (
        this.userProfileForm.value.email !== this.userProfile?.email ||
        this.userProfileForm.value.companyUnit !==
          this.userProfile?.companyUnit ||
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
          .patch<UserProfile>(
            `${environment.baseUrl}` + '/user/player-update',this.userProfileForm.value,{ headers }
          )
          .subscribe(
            (res:any) => {
              this.userProfile=res.data.teamId
              this.tostr.success('Profile Updated Successfully');
              const formData = new FormData();
              if (this.selectedFile) {
                formData.append('avatar', this.selectedFile);
                this.http
                  .patch(
                    `${environment.baseUrl}` + ' /images/' + userId ,
                    formData,{headers}
                  )
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
  // /user/player-update
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
}
