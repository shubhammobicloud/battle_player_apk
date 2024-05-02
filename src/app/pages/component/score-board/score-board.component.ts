import { Component, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { environment } from 'src/environment/enviroment';
import { map, take } from 'rxjs';
import { RankingService } from 'src/app/services/ranking/ranking.service';
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
  eventImageURL: string = '../../../../assets/ground.jpg';
  baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private rankingService:RankingService,
  ) {}
  ngOnInit(): void {
    this.getEventImage();
    this.getTeamImages();
  }
  // getTeamScore(teamName1: string, teamName2: string): void {
  //   console.log(teamName1,teamName2,"2 team data found")
  //   this.rankingService.getcompanyTeamRanking()
  //     .pipe(
  //       map((data:any) => {
  //         const teams = data.data; // Assuming the data structure has a 'teams' property
  //         if (teams && Array.isArray(teams)) {
  //           const team1 = teams.find(team => team.name == teamName1);
  //           const team2 = teams.find(team => team.name == teamName2);
  //           if (team1 && team2) {
  //             // Both teams found, now you can do whatever you want with their scores
  //             console.log(`${teamName1} score: ${team1.rankingScore}`);
  //             console.log(`${teamName2} score: ${team2.rankingScore}`);
  //             this.teamAScore=team1.rankingScore
  //             this.teamBScore=team2.rankingScore
  //           } else {
  //             console.log('One or both teams not found.');
  //           }
  //         } else {
  //           console.log('Teams data not found or not in the expected format.');
  //         }
  //       })
  //     )
  //     .subscribe();
  // }

  async share() {
    const divElement = document.getElementById('myDiv');

    if (!divElement) {
      console.error('Element with ID "myDiv" not found.');
      return; // Handle the case where the element is not found
    }

    try {
      // Capture the div content as a canvas element
      const canvas = await html2canvas(divElement);

      const dataURL = canvas.toDataURL('image/png');

      // Check if the data URL is valid (optional)
      if (!this.isValidDataURL(dataURL)) {
        console.error(
          'Invalid data URL. Ensure the div content is valid for canvas capture.'
        );
        return;
      }

      // Choose a suitable directory for saving the image (optional)
      let directory = Directory.Cache; // Or choose a different directory based on your needs
      // console.log(dataURL);

      // Generate a unique filename (optional)
      const filename = this.generateUniqueFilename('image_', '.png');

      let success = false;

      // Attempt to write to different directories, stopping on the first success
      try {
        await this.writeToFilesystem(
          Directory.Documents,
          `${filename}`,
          dataURL
        );
        directory = Directory.Documents;
        success = true;
      } catch (error) {
        console.error('Error writing to Documents directory:', error);
      }

      if (!success) {
        try {
          await this.writeToFilesystem(Directory.Cache, filename, dataURL);
          directory = Directory.Cache;
          success = true;
        } catch (error) {
          console.error('Error writing to Cache directory:', error);
        }
      }

      if (success) {
        console.log(directory, 'Chosen directory');
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
      console.log(directoryExists, directoryPath);
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

  // (Optional) Function to check data URL validity (replace with your validation logic)
  isValidDataURL(dataURL: string): boolean {
    // Implement your validation logic here, checking for the expected format and content of the data URL
    return true; // Replace with your actual validation logic
  }

  // (Optional) Function to generate a unique filename (example based on a prefix and extension)
  generateUniqueFilename(prefix: string, extension: string): string {
    const timestamp = Date.now();
    return `${prefix}${timestamp}${extension}`;
  }

  getEventImage() {
    this.dashboardService.getEventImage().subscribe({
      next: (res) => {
        console.log('api res', res);
        this.storeImageLocally(
          res.data.avatar
            ? `${environment.baseUrl}images/${res.data.avatar}`
            : this.eventImageURL
        ).subscribe((res) => {
          console.log(URL.createObjectURL(res));
          this.centerLogo = URL.createObjectURL(res);
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log('api error ', err);
      },
    });
  }

  getTeamImages() {
    this.dashboardService.getTeamImages().subscribe({
      next: (res) => {
        console.log('api res', res);
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
          console.log(rankRes.data._id,"Asddddddddddd")
          rankRes.data.forEach((findId:any)=>{
            console.log(findId,"Asddddddddddd",res.data.name)
            if(res.data.name==findId.name){
              this.teamAScore=findId.rankingScore;
            }
            if(res.data.battlePartnerTeamId.name==findId.name){
              this.teamBScore=findId.rankingScore;
            }
          })

        })
      },
      error: (err: HttpErrorResponse) => {
        console.log('api error ', err);
      },
    });
  }

  storeImageLocally(imgUrl: string) {
    return this.http.get(imgUrl, { responseType: 'blob' }).pipe(take(1));
  }
}
