import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment/enviroment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
// "data": {
//   "_id": "65eedf006c6e03bb7e4945cd",
//   "email": "vikrant@mobicloud.co.in",
//   "password": "$2b$10$66WJ4yGnrq.4Aj6uAbCY6.Shp6/7li89pvK7RcZuJOGpN8Hq0N2VK",
//   "gameLeader": true,
//   "teamId": "65eedf006c6e03bb7e4945ca",
//   "companyUnit": "Region North",
//   "targetOrSalesRepLC": 12000,
//   "salesRepNo": 4566,
//   "firstLogin": true,
//   "createdAt": "2024-03-11T10:37:52.448Z",
//   "updatedAt": "2024-03-11T12:30:45.631Z",
//   "__v": 0,
//   "avatar": "1710160245627-logo wurth (1).png"
// },
interface UserProfile {
  email: string;
  userName:string;
  companyUnit:number;
  avatar: string;
  teamId:string;
  gameLeader:boolean;
  teamName:string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  userProfileForm!: FormGroup;
  allowEdit: any;
  link = environment.baseUrl;
  isEditMode = false;
  constructor(private http:HttpClient, private  authService:AuthService,private fb: FormBuilder) {}
  ngOnInit() {
    this.getUserDetails();
    this.initForm();
  }

  initForm(): void {
    this.userProfileForm = this.fb.group({
      userName: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, Validators.email],
      gameLeader: [{ value: '', disabled: true }],
      companyUnit: [{ value: '', disabled: true }],
    });
  }
teamName:any;
  getUserDetails() {
    const userId = this.authService.getUserIdFromToken(); // Assuming authentication
    this.http.get<UserProfile>(environment.baseUrl + 'user-details/' + userId)
      .subscribe((response:any) => {
        this.userProfile = response.data;
        this.http.get<UserProfile>(environment.baseUrl + 'getTeam/' +  response.data.teamId).subscribe(res=>{
          this.teamName=res.teamName
        })
        console.log('User profile:', response); // For debugging
      });
  }
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.userProfileForm.enable();
    } else {
      this.userProfileForm.disable();
    }
  }

  selectedFile: File | null = null;
  displayedImage: string | ArrayBuffer | null = 'https://www.w3schools.com/howto/img_avatar.png';

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

}

