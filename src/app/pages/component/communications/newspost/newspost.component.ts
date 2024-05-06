import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environment/enviroment';
import { NewsUpdateService } from 'src/app/services/news/newsUpdate.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-newspost',
  templateUrl: './newspost.component.html',
  styleUrls: ['./newspost.component.scss'],
})
export class NewspostComponent implements OnInit, OnDestroy {
  // inputString: string = '';
  characterCount: number = 0;

  
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
    private route: Router,
    private toastr: ToastrService,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    let data: any = this.updateService.news;
    this.newsId = data._id;
    if (this.newsId) {
      console.log(data, 'hii');
      this.updateNews = true;
      this.newsContent.patchValue({
        content: data.content,
        title: data.title,
      });
    }
    this.countCharacters();
  }

  config: AngularEditorConfig = {
    editable: true,
    enableToolbar: false,
    showToolbar: true,
    spellcheck: true,
    minHeight: '20rem',
    maxHeight: '20rem',
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      console.log('file is', file);
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
                  console.log('Upload successful:', response.body.imageUrl);
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

  countCharacters() {
    const editorContent = this.newsContent.get('content')?.value;
    if (editorContent) {
        // Remove spaces between characters using regular expression
        const stringWithoutSpacesBetweenChars = editorContent.replace(/(\S)(\s+)(?=\S)/g, '$1');
        // Count characters
        this.characterCount = stringWithoutSpacesBetweenChars.length;
    } else {
        this.characterCount = 0;
    }
}


  submitContent() {
    if (this.newsContent.valid) {
      console.log(this.newsContent.value);
      if (this.updateNews) {
        this.http
          .patch(
            environment.baseUrl + 'news/' + this.newsId,
            this.newsContent.value
          )
          .subscribe(
            (res: any) => {
              console.log('vffrr', res);
              if (res.statusCode == 200) {
                this.updateParentState1.emit(false);
                this.toastr.success(res.message);

                // this.route.navigate(['/', 'dashboard', 'news-list']);
              }
            },
            (error: HttpErrorResponse) => {
              console.log('error in api ', error);
              this.toastr.error(error.error.message);
            }
          );
      } else {
        console.log('news adding', this.images);
        this.updateService.postNews(this.newsContent.value).subscribe(
          (res: any) => {
            console.log(res);
            if (res.statusCode == 200) {
              this.toastr.success('News added successfully');

              this.updateParentState1.emit(false);
            }
          },
          (error: HttpErrorResponse) => {
            console.log('error in api', error);
            this.toastr.error(error.error.message);
          }
        );
      }
    } else {
      this.toastr.error('Enter All Fields');
    }
  }

  addVideo() {
    const videoLink = prompt('Please enter the YouTube video URL:');
    if (videoLink) {
      const videoId = this.getYouTubeVideoId(videoLink);
      if (videoId) {
        const videoEmbedCode = `<div>
                          <iframe src="https://www.youtube.com/embed/${videoId}" style="position: relative; width: 100%; max-width: 500px; min-height: 250px;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>`;
        this.editor.executeCommand('insertHtml', videoEmbedCode);
      } else {
        alert('Invalid YouTube video URL.');
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
