import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environment/enviroment';
import { NewsUpdateService } from 'src/app/services/news/newsUpdate.service';
import { ToastrService } from 'ngx-toastr';
import { Observable,Observer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-newspost',
  templateUrl: './newspost.component.html',
  styleUrls: ['./newspost.component.scss'],
})
export class NewspostComponent implements OnInit, OnDestroy{
  // inputString: string = '';
  characterCount: number = 0;
  maxCharacters: number = 800;

  @Output() updateParentState1: EventEmitter<any> = new EventEmitter<any>();
  showTeamChat: boolean = false;
  @ViewChild('editor') editor: ElementRef | any;

  images: any[] = [];

  newsContent = new FormGroup({
    content: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
  });

  updateNews: boolean = false;
  newsId!: string;

  constructor(
    private http: HttpClient,
    private updateService: NewsUpdateService,
    private toastr: ToastrService,
    public translate:TranslateService
  ) {
    let lang = localStorage.getItem('lang');
    if (lang) {
      translate.use(lang)
    }

  }

  ngOnInit(): void {
    let data: any = this.updateService.news;
    this.newsId = data._id;
    if (this.newsId) {
      this.updateNews = true;
      this.newsContent.patchValue({
        content: data.content,
        title: data.title,
      });
    }

  }

  config: AngularEditorConfig = {
    editable: true,
    enableToolbar: false,
    showToolbar: true,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      // console.log('file is', file);
      return Observable.create(
        (observer: Observer<HttpEvent<UploadResponse>>) => {
          const maxDimension = 250; // Maximum width or height for the resized image

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const image = new Image();
          image.src = URL.createObjectURL(file);
          image.classList.add('insideNews'); // Add your class name here

          image.onload = () => {
            let width = image.width;
            let height = image.height;
            image.classList.add('insideNews');
            image.className = 'insideNews';
            // Resize the image if either dimension is greater than the maximum
            if (width > maxDimension || height > maxDimension) {
              // Calculate the new dimensions while maintaining aspect ratio
              if (width > height) {
                height *= maxDimension / width;
                width = maxDimension;
              } else {
                width *= maxDimension / height;
                height = maxDimension;
              }
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw image on canvas with new dimensions
            ctx?.drawImage(image, 0, 0, width, height);

            // Convert canvas content to Blob
            canvas.toBlob((blob) => {
              if (!blob) {
                observer.error('Failed to resize image');
                return;
              }

              // Create FormData and append resized image
              const formData = new FormData();
              formData.append('file', blob, file.name);
              this.updateService.uploadNews(formData).subscribe(
                (response: any) => {
                  // console.log('Upload successful:', response.body.imageUrl);
                  this.images.push(response.body.imageUrl);
                  observer.next(response);
                  observer.complete();
                },
                (error) => {
                  console.error('Upload failed:', error);
                }
              );
            }, file.type);
          };
        }
      );
    },
    placeholder: this.translate.instant('COMMUNICATION_PAGE.NEWS_POST_PAGE.EDITOR_PLACEHOLDER'),
    translate: 'no',
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['insertVideo', 'toggleEditorMode']],
  };

  countCharacters(event: any) {
    const editorContent = this.newsContent.get('content')?.value;
    if (editorContent) {
      // Remove non-character content using regular expression
      const cleanContent = editorContent.replace(/[^a-zA-Z]/g, '');
      // Count characters
      this.characterCount = cleanContent.length;

      // Allow backspace to work
      if (event.keyCode === 8 || event.keyCode === 46) { // 8 is the key code for backspace, 46 for delete
        return;
      }

      // Disable typing when character count exceeds 800
      if (this.characterCount >= 800 && (event.key.length === 1 && /[a-zA-Z]/.test(event.key))) {
        event.preventDefault(); // Prevent further key presses
      }
    } else {
      this.characterCount = 0; // If content is null, set character count to 0
    }

    // Check if the target is the video input
    if (event.target.id === 'video-input') {
      // Allow only up to 3 characters in the video input
      if (event.target.value.length >= 3) {
        event.preventDefault();
      }
    }

    // Prevent accepting pasted characters
    if (event.type === 'paste') {
      event.preventDefault();
    }
  }

  preventPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }


  submitContent() {
    // Check if the form is valid
    if (this.newsContent.valid) {
      // Get the character count
      const editorContent = this.newsContent.get('content')?.value;
      const cleanContent = editorContent ? editorContent.replace(/[^a-zA-Z]/g, '') : '';
      const characterCount = cleanContent.length;

      // Check if character count exceeds 800
      if (characterCount > 800) {
        this.toastr.error("Character count should not exceed 800");
        return; // Stop further execution
      }

      // Proceed with HTTP request if character count is within limit
      if (this.updateNews) {
        // Update news logic
        this.http
          .patch(
            environment.baseUrl + 'news/' + this.newsId,
            this.newsContent.value
          )
          .subscribe(
            (res: any) => {
              // console.log('vffrr', res);
              if (res.statusCode == 200) {
                this.updateParentState1.emit(false);
                this.toastr.success(res.message);
              }
            },
            (error: HttpErrorResponse) => {
              this.toastr.error(error.error.message);
            }
          );
      } else {
        // Add news logic
        this.updateService.postNews(this.newsContent.value).subscribe(
          (res: any) => {
            // console.log(res);
            if (res.statusCode == 200) {
              this.toastr.success(this.translate.instant('TOASTER_RESPONSE.NEWS_ADDED_SUCCESS'));
              this.updateParentState1.emit(false);
            }
          },
          (error: HttpErrorResponse) => {
            // console.log('error in api', error);
            if(error.error.message=="Title should not be empty."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_EMPTY_TITLE'));
            }
            else if(error.error.message=="Unauthorized"){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_UNAUTHORIZED'));
            }
            else if(error.error.message=="Something went wrong on the server."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'));
            }
            else if(error.error.message=="The title must contain a minimum of 10 characters."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_TITLE_LENGTH_MINIMUM'));
            }
            else if(error.error.message=="The title must not exceed 200 characters."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_TITLE_LENGTH_MAXIMUM'));
            }
            else if(error.error.message=="Content should not be empty."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_EMPTY_CONTENT'));
            }
            else if(error.error.message=="Forbidden"){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_UNAUTHORIZED'));
            }
            else if(error.error.message=="Content should be between 10 and 1000 characters."){
              this.toastr.error(this.translate.instant('TOASTER_ERROR.ERROR_CONTENT_LENGTH'));
            }
            else{
              // console.log('error in api ', error);
              this.toastr.error(this.translate.instant('TOASTER_RESPONSE.SERVER_ERROR'));
            }

          }
        );
      }
    } else {
      this.toastr.error(this.translate.instant('TOASTER_RESPONSE.ENTER_ALL_FIELDS_ERROR'));
    }
  }
  private videoCount: number = 0;

  addVideo() {
    if (this.videoCount >= 3) {
      // alert('You can only add up to 3 videos.');
      this.toastr.warning(this.translate.instant('TOASTER_RESPONSE.VIDEO_CAPACITY_ERROR'))
      return;
    }

    const videoLink = prompt(this.translate.instant('TOASTER_RESPONSE.PROMPT_VIDEO_URL'));
    if (videoLink) {
      const videoId = this.getYouTubeVideoId(videoLink);
      if (videoId) {
        const videoEmbedCode = `<div>
                                  <iframe src="https://www.youtube.com/embed/${videoId}" style="position: relative; width: 100%; max-width: 500px; min-height: 250px;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>`;
        this.editor.executeCommand('insertHtml', videoEmbedCode);
        this.videoCount++; // Increment the count after adding a video
      } else {
        this.toastr.error(this.translate.instant('TOASTER_RESPONSE.INVALID_YOUTUBE_URL'));

      }
    }
  }


  getYouTubeVideoId(url: string): string | null {
    const videoIdRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  }
  ngOnDestroy(): void {
    this.updateService.news = [];
  }
}
