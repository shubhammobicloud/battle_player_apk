import { Component,OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss']
})
export class ScoreBoardComponent implements OnInit {
  teamAName: string = 'Team A';
  teamBName: string = 'Team B';
  centerLogo: string = '../../assets/sports logo.png';
  teamAImage:string='../../assets/teambimage.jpg';
  teamBImage:string='../../assets/teamImage.png'
  dynamicImageUrl: string = 'path_to_dynamic_image.png';
  teamAScore: number = 30;
  teamBScore: number = 60;

constructor(private authService:AuthService,private http:HttpClient){}
ngOnInit(): void {
   let id= localStorage.getItem( "token");
    // console.log(id,"USER ID")/
  // this.http.get(environment.baseUrl+'playerDetails/'+id).subscribe((res:any)=>{

  //       localStorage.setItem( "userId" , res.data._id);
  //       localStorage.setItem( "teamId" , res.data.teamId);
  //       localStorage.setItem('avatar',res.data.avatar);
  //       localStorage.setItem('userName',res.data.userName);
  //   // console.log(res)
  // })
}


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
        console.error('Invalid data URL. Ensure the div content is valid for canvas capture.');
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
        await this.writeToFilesystem(Directory.Documents, `${filename}`, dataURL);
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
        console.log(directory, "Chosen directory");
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
    const directoryExists = await this.doesDirectoryExist(directory, directoryPath);
    if (!directoryExists) {
      await Filesystem.mkdir({
        path: directoryPath,
        directory,
        recursive: true, // Create parent directories if they don't exist
      });
      console.log(directoryExists,directoryPath)
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
}
