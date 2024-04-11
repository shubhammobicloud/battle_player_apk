import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/users/users.service';
interface UserProfile {
  email: string;
  userName: string;
  companyUnit: string;
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
  isEditMode = false;
  link = environment.baseUrl;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private tostr: ToastrService,
    private userService:UserService
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
      displayedImage: [{ value: '' }],
    });
  }
  getUserDetails() {
   this.userService.getProfileDetails().subscribe((response: any) => {
        this.userProfile = response.data;
        this.populateForm();
      });
  }

  populateForm(): void {
    if (this.userProfile) {
      this.userProfileForm.patchValue({
        email: this.userProfile.email,
        companyUnit: (this.userProfile.teamId as unknown as { [key: string]: string })[
          'companyUnit'
        ],
        name: (this.userProfile.teamId as unknown as { [key: string]: string })[
          'name'
        ],
        displayedImage:this.userProfile.avatar as unknown as {[key:string]:string}['avatar']
      });
    }
    this.displayedImage=this.userProfileForm.get('displayedImage')?.value
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      // this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
      if (this.selectedFile) {
              const formData = new FormData();
              if (this.selectedFile) {
                formData.append('avatar', this.selectedFile);
                 this.userService.updatePlayer(formData).subscribe((res: any) => {

                    console.log('Image saved successfully');
                  });
              }
            }

      }

  }
  // /user/player-update
  selectedFile: File | null = null;
  displayedImage: string | ArrayBuffer | null = 'https://www.w3schools.com/howto/img_avatar.png';
  showImage=false;
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
