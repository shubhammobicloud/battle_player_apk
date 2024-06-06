import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { environment } from 'src/environment/enviroment';
import { take, tap } from 'rxjs';
import { RankingService } from 'src/app/services/ranking/ranking.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxCaptureService } from 'ngx-capture';
@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
})
export class ScoreBoardComponent implements OnInit {
  teamAName: string = 'Team A';
  teamBName: string = 'Team B';
  centerLogo: string = '../../assets/sports logo.png';
  teamAImage: string = '../../assets/teambimage.jpg';
  teamBImage: string = '../../assets/teamImage.png';
  dynamicImageUrl: string = 'path_to_dynamic_image.png';
  teamAScore: number = 0;
  teamBScore: number = 0;
  winner = ''
  eventImageURL: string = '../../../../assets/ground.png';
  tennisBall = '../../../../assets/tenisBall.svg'
  baseUrl: string = environment.baseUrl;

  constructor(
    private captureService: NgxCaptureService,
    private http: HttpClient,
    private dashboardService: DashboardService,
    private rankingService:RankingService,
    public translate:TranslateService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getEventImage().subscribe({
      next:(res:any)=>{
        this.centerLogo = this.baseUrl+'images/'+res.data.dashboardImage
        this.eventImageURL= this.baseUrl+'images/'+res.data.groundImage
      }
    })
    this.getEventImage();
    this.getTeamImages();
  }

 @ViewChild('selectImage', { static: true }) screen!: ElementRef;

  async share() {


    try {
      let success = false;
      let directory = Directory.Cache; // Or choose a different directory based on your needs
      this.captureService.getImage(this.screen.nativeElement, true).pipe(tap(async(img) => {
        try {
          // this.captureService.downloadImage(img)
          const filename = this.generateUniqueFilename('image_', '.png');
          await this.writeToFilesystem(
            Directory.Documents,
            `${filename}`,
            img
          );
          directory = Directory.Documents;
          success = true;

          if (success) {
            // console.log(directory, 'Chosen directory');
          }

          const fileUri = await Filesystem.getUri({
            directory,
            path: filename,
          });

          // Share the image file path
          await Share.share({
            title: 'Share this image',
            text: 'Check out this image!',
            url: fileUri.uri,
          });
          if (!success) {
            try {
              await this.writeToFilesystem(Directory.Cache, filename, img);
              directory = Directory.Cache;
              success = true;

            } catch (error) {
              console.error('Error writing to Cache directory:', error);
            }
          }
        } catch (error) {
          console.error('Error writing to Documents directory:', error);
        }
      }


    )
  )
  .subscribe()

      // Generate a unique filename (optional)

    } catch (error) {
      console.error('Error capturing or sharing image:', error);
    }
  }

  // Function to write to the filesystem
  async writeToFilesystem(directory: Directory, path: string, data: string) {
    // Check if the directory exists, and create it if not
    await this.ensureDirectoryExists(directory, path);

    // Write the file to the specified path
    await Filesystem.writeFile({
      path,
      directory,
      data: data.substring(data.indexOf(',') + 1), // Remove data URL prefix
    });
  }

  // Function to ensure a directory exists
  async ensureDirectoryExists(directory: Directory, path: string) {
    const directoryPath = path.substring(0, path.lastIndexOf('/'));

    // Check if the directory exists, and create it if not
    const directoryExists = await this.doesDirectoryExist(
      directory,
      directoryPath
    );
    if (!directoryExists) {
      await Filesystem.mkdir({
        path: directoryPath,
        directory,
        recursive: true, // Create parent directories if they don't exist
      });
      // console.log(directoryExists, directoryPath);
    }
  }

  // Function to check if a directory exists
  async doesDirectoryExist(directory: Directory, directoryPath: string) {
    try {
      // Attempt to read the directory
      await Filesystem.readdir({
        path: directoryPath,
        directory,
      });

      // If the readdir call succeeds, the directory exists
      return true;
    } catch (error) {
      // If an error occurs, assume the directory doesn't exist
      return false;
    }
  }



  // (Optional) Function to generate a unique filename (example based on a prefix and extension)
  generateUniqueFilename(prefix: string, extension: string): string {
    const timestamp = Date.now();
    return `${prefix}${timestamp}${extension}`;
  }

  getEventImage() {
    this.dashboardService.getEventImage().subscribe({
      next: (res) => {
        // console.log('api res', res);
        this.storeImageLocally(
          res.data.avatar
            ? `${environment.baseUrl}images/${res.data.avatar}`
            : this.eventImageURL
        ).subscribe((res) => {
          // console.log(URL.createObjectURL(res));
          // this.centerLogo = URL.createObjectURL(res);
        });
      },
      error: (err: HttpErrorResponse) => {
        // console.log('api error ', err);
      },
    });
  }

  getTeamImages() {
    this.dashboardService.getTeamImages().subscribe({
      next: (res) => {
        // console.log('api res', res);
        // this.teamAImage = res.data?.avatar?`${environment.baseUrl}images/${res.data.avatar}`:this.teamBImage;
        this.storeImageLocally(
          res.data?.avatar
            ? `${environment.baseUrl}images/${res.data.avatar}`
            : this.teamBImage
        ).subscribe((res) => {
          // console.log(URL.createObjectURL(res));
          this.teamAImage = URL.createObjectURL(res);
        });
        this.storeImageLocally(
          res.data?.battlePartnerTeamId?.avatar
            ? `${environment.baseUrl}images/${res.data.battlePartnerTeamId.avatar}`
            : this.teamBImage
        ).subscribe((res) => {
          // console.log(URL.createObjectURL(res));
          this.teamBImage = URL.createObjectURL(res);
        });
        this.teamAName = res.data?.name;
        this.teamBName = res.data?.battlePartnerTeamId?.name;

        // this.teamAScore = (res.data?.currentSales / res.data?.targetSales) * 100;
        // this.teamBScore = (res.data?.battlePartnerTeamId?.currentSales /  res.data?.battlePartnerTeamId?.targetSales) *  100;
        // this.getTeamScore(this.teamAName,this.teamBName)
        this.rankingService.getTeamRankingOfTwoTeams(res.data._id,res.data.battlePartnerTeamId._id).subscribe((rankRes)=>{
          // console.log(rankRes.data._id,"Asddddddddddd")
          rankRes.data.forEach((findId:any)=>{
            // console.log(findId,"Asddddddddddd",res.data.name)
            if(res.data.name==findId.name){
              this.teamAScore=findId.rankingScore;
            }
            if(res.data.battlePartnerTeamId.name==findId.name){
              this.teamBScore=findId.rankingScore;
            }
            if(this.teamAScore>this.teamBScore){
              this.winner='teamA'
            }else if(this.teamAScore<this.teamBScore){
              this.winner='teamB'
            }
          })

        },
        (error)=>{
          if(error.error.message=='Invalid team id or battle partner team id'){
            this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_INVALID_TEAM_OR_BATTLE_PARTNER_ID'))
          }else{
            this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'))
          }
        }
        )
      },
      error: (err: HttpErrorResponse) => {
        if(err.error.message=='Resource not found. Please check the ID and try again.'){
          // this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_RESOURCE_NOT_FOUND'))

        }else if(err.error.message=='No Team data found.'){
          this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_NO_TEAM_DATA_FOUND'))
        }else{
          this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'))
        }
      },
    });
  }

  storeImageLocally(imgUrl: string) {
    return this.http.get(imgUrl, { responseType: 'blob' }).pipe(take(1));
  }
}
