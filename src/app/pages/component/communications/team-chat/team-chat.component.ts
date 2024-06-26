import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewChecked,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { io } from 'socket.io-client';
import { TranslateService } from '@ngx-translate/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { environment } from 'src/environment/enviroment';
@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.scss'],
})
export class TeamChatComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  url: string = `${environment.baseUrl}`;
  id = localStorage.getItem('userId');
  avatar = localStorage.getItem('avatar');
  username = localStorage.getItem('userName');
  teamId = localStorage.getItem('teamId');
  socket: any;
  chats: any[] = [];
  message: string = '';
  counter = 0;
  showFullMessage: boolean = false;
  showMediaBtns: boolean = false;
  selectedImage: string | ArrayBuffer | null = null;
  selectedVideo: string | ArrayBuffer | null = null;
  selectedDocument: string | ArrayBuffer | null = null;

  selectedMedia!: File;
  mediaError: boolean = false;
  videoUrl: string = '';
  type: string = 'text';
  showImgPopup: boolean = false;
  showVidPopup: boolean = false;
  popupImgUrl: string = '';
  popupVidUrl: string = '';

  videoUploadInProgress = false;
  mediaDownloadInProgress = false;
  contentOrFilePath!: string

  @ViewChild('teamChatTextarea') teamChatTextarea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('documentInput') documentInput!: ElementRef;
  @ViewChild('chatwrapper') chatwrapper!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private http: HttpClient,
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private translate:TranslateService
  ) { }

  @ViewChild('chatContainer', { static: true }) container:
    | ElementRef
    | undefined;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000);
  }
  ngAfterViewChecked(): void {
    // this.scrollToBottom()
  }
  async ngOnDestroy() {
    // console.log('Internet is not on or connection is very slow.');
    const response = await this.socket
      .timeout(5000)
      .emitWithAck('disconnected', { teamId: this.teamId });
  }
  async ngOnInit() {
    // this.loadInitialChunk();
    console.log(this.id,this.teamId,"asdadadads")
    this.socket = io(`${this.url}team-namespaces`, {
      auth: {
        serverOffset: this.id,
        teamId: this.teamId,
      },
      // enable retries
      ackTimeout: 10000,
      retries: 3,
    });
    this.socket.disconnect;

    // Listen for the 'connect' event
    this.socket.on('connect', async () => {
      // console.log('Socket.IO connected successfully');
      try {
        const response = await this.socket
          .timeout(5000)
          .emitWithAck('joinRoom', { teamId: this.teamId });
        // console.log(response,"response of joinRoom"); // 'ok'
        if (response.status == 'error') {
          // alert(response.message);
          // this.toastr.error(response.message)
        }
        if (response.status == 'ok') {
          const response = await this.socket
            .timeout(5000)
            .emitWithAck('loadChat', {
              teamId: this.teamId,
              limit: 8,
              page: this.page,
            });
          // console.log(response,"response of loadChat");
          if (response.status == 'error') {
            // alert(response.message);
          }
          if (response.status == 'ok') {
            // const chats = response.existingChat;
            this.chats = response.orderedChat;
            // console.log('chats', this.chats);
          }
        }
      } catch (error) {
        // console.log(error,"error message of joinRoom")
      }
    });

    // Listen for the 'connect_error' event
    this.socket.on('connect_error', (error: Error) => {
      // alert('Socket.IO connection error:'+ error.message);
      console.error('Socket.IO connection error:', error.message);
    });

    // Listen for the 'connect_timeout' event
    this.socket.on('connect_timeout', (timeout: number) => {
      // alert('Socket.IO connection timeout:'+ timeout)
      console.error('Socket.IO connection timeout: ', timeout);
    });

    // disconnect
    this.socket.on('disconnect', async () => {
      // alert('Internet is not on or connection is very slow.');
    });

    this.socket.on('loadNewTeamChat', (data: any, callback: any) => {
      try {
        // console.log('data', data);

        const newChat = {
          contentOrFilePath: data.contentOrFilePath,
          createdAt: data.createdAt,
          type: data.type,
          teamId: data.teamId,
          senderId: {
            _id: data._id,
            avatar: data.avatar,
            userName: data.username,
          },
        };
        this.socket.auth.serverOffset = data.id;
        this.chats.push(newChat);
        this.scrollToBottom();
        // console.log(data, 'response of loadNewTeamChat')
        callback({
          status: 'ok',
        });
      } catch (error) {
        //  alert("error occured while loading new data");
      }
    });
  }
  sum = 0
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  onScrollDown() {

    this.sum += 20;
    // add another 20 items
  }


  currentUser = (senderId: any): boolean => {
    const userId = localStorage.getItem('userId');
    // console.log('userId', userId, 'senderId', senderId);

    return userId !== null && userId !== undefined && senderId?._id === userId;
  };

  async sendMessage() {
    // if (this.message !== '') {
    const selfMessage = {
      contentOrFilePath: this.message,
      teamId: this.teamId,
      type: this.type,
      createdAt: Date.now(),
      senderId: {
        _id: this.id,
        avatar: this.avatar,
        userName: this.username,
      },
      // imageUrl: this.selectedImage ? this.selectedImage : null,
      // videoUrl: this.selectedVideo ? this.selectedVideo : null,
      // documentName: this.selectedDocument ? this.selectedDocument : null,
    };

    let data = {
      contentOrFilePath: this.message,
      senderId: this.id,
      teamId: this.teamId,
      avatar: this.avatar,
      username: this.username,
      type: this.type,
    };

    // console.log('self message', selfMessage);
    if (this.message == '') {
      if (!this.mediaError) {
        this.videoUploadInProgress = true
        this.selectedImage = null;
        this.selectedVideo = null;
        this.selectedDocument = null;
        this.chatService.uploadMedia(this.selectedMedia).subscribe(
          async (res: any) => {
            // this.chats.push(selfMessage);
            this.videoUploadInProgress = false
            data.contentOrFilePath = res.data;
            selfMessage.contentOrFilePath = res.data;
            this.mediaError = true
            try {
              const response = await this.socket
                .timeout(5000)
                .emitWithAck('newTeamChat', data);
              // console.log(response,"response of newTeamChat"); // 'ok'
              if (response.status == 'ok') {
                // this.message = '';
                this.chats.push(selfMessage);

              }
              if (response.status == 'error') {
                // alert(response.message);
                // this.toastr.error(response.message);
              }
            } catch (error: any) {
              // console.log(error.message);
            }
          },
          (error: HttpErrorResponse) => {
            console.log('error', error);
            this.toastr.error(this.translate.instant('TOASTER_ERROR.SERVER_ERROR'));
          }
        );
      }
      else {
        console.log("media error")
      }
    } else {
      // console.log(this.socket.id,"socket id");
      // compute a unique offset
      // this.chats.push(selfMessage);
      this.selectedImage = null;
      this.selectedVideo = null;
      this.selectedDocument = null;

      this.scrollToBottom();

      try {
        const response = await this.socket
          .timeout(5000)
          .emitWithAck('newTeamChat', data);
        // console.log(response,"response of newTeamChat"); // 'ok'
        if (response.status == 'ok') {
          this.message = '';
          this.chats.push(selfMessage);
          // console.log('self message', selfMessage);
        }
        if (response.status == 'error') {
          // alert(response.message);
          // this.toastr.error(response.message)
        }
      } catch (error: any) {
        // console.log(error.message);
      }
    }
  }
  @ViewChild('chatwrapper', { static: true }) chatWrapper!: ElementRef;

  scrollbarHeight!: number;

  scrollToBottom() {
    try {
      setTimeout(() => {
        this.scrollbarHeight = this.chatWrapper.nativeElement.scrollHeight;
        this.chatWrapper.nativeElement.scrollTop = this.scrollbarHeight;
      }, 0);
    } catch (err) {
      console.error(err);
    }
  }

  toggleExpand(chat: any) {
    chat.expanded = !chat.expanded;
  }
  onInput() {
    this.teamChatTextarea.nativeElement.style.border = '';
  }
  toggleMediaButtons() {
    this.showMediaBtns = !this.showMediaBtns;
  }
  selectFile(type: string) {
    if (type === 'image') {
      this.fileInput.nativeElement.click();
    } else if (type === 'video') {
      this.videoInput.nativeElement.click();
    } else if (type === 'document') {
      this.documentInput.nativeElement.click();
    }
  }
  onFileSelected(event: any, type: string) {
    this.showMediaBtns = false;
    this.mediaError = false;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMedia = input.files[0];
      const file = input.files[0];
      // console.log(`Selected ${type}:`, file);
      this.type = type;
      if (type === 'image') {
        let maxFileSize = 20 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.toastr.error(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.IMAGE_MAX_SIZE'));
          this.mediaError = true;
        } else {
          this.readFile(file, 'image');
        }
      } else if (type === 'video') {
        let maxFileSize = 20 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.toastr.error(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.VIDEO_MAX_SIZE'));
          this.mediaError = true;
        } else {
          this.readFile(file, 'video');
        }
      } else if (type === 'document') {
        let maxFileSize = 20 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.toastr.error(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.DOCUMENT_MAX_SIZE'));
          this.mediaError = true;
        } else {
          this.readFile(file, 'document');
        }
      }
    }
    event.target.value = ''
  }
  readFile(file: File, type: string) {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'image') {
        this.selectedImage = reader.result;
      } else if (type === 'video') {
        this.selectedVideo = reader.result;
      } else if (type === 'document') {
        this.selectedDocument = file.name;
      }
    };
    reader.readAsDataURL(file);
  }

  showImagePopup(popupImgUrl: string, type: string) {
    if (type === 'local') {
      this.popupImgUrl = popupImgUrl;
      // console.log('popup img url', popupImgUrl);
      this.showImgPopup = !this.showImgPopup;
    } else if (type === 'uploaded') {
      this.popupImgUrl = `${this.url}chat/${popupImgUrl}`;
      // console.log('popup img url', popupImgUrl);
      this.showImgPopup = !this.showImgPopup;
    } else {
      this.showImgPopup = !this.showImgPopup;
    }
  }

  showVideoPopup(popupVidUrl: string) {
    this.popupVidUrl = popupVidUrl;
    // console.log('popup img url', popupVidUrl);
    this.showVidPopup = !this.showVidPopup;
  }

  removeSelectedMedia(type: string) {
    if (type == 'img') this.selectedImage = null;
    else if (type == 'video') this.selectedVideo = null;
    else if (type == 'doc') {
      this.selectedDocument = null;
    }
  }

  counter1 = 2;
  previousScrollHeight!: number;

  async onScrollUp() {
    // console.log('scrolled up!!');
    this.previousScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
    // console.log('up height', this.previousScrollHeight);

    await this.addChats().then(() => {
      this.adjustScrollPosition().then(() => { });
    });

    this.counter1++;
  }

  page = 1;
  addChats(): Promise<void> {
    return new Promise(async (resolve) => {
      this.page++;
      const response = await this.socket.timeout(5000).emitWithAck('loadChat', {
        teamId: this.teamId,
        limit: 7,
        page: this.page,
      });
      if (response.status == 'error') {
        console.log(response.message);
      }
      if (response.status == 'ok') {
        // const chats = response.existingChat;
        this.chats = [...response.orderedChat, ...this.chats];
        // console.log('chats', this.chats);
      }

      resolve();
    });
  }
  multiplyer = 1;
  adjustScrollPosition(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const newScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
          const addedContentHeight =
            newScrollHeight - this.previousScrollHeight;

          // console.log('Previous scroll height:', this.previousScrollHeight);
          // console.log('New scroll height:', newScrollHeight);
          // console.log('Added content height:', addedContentHeight);
          // console.log('Scroll position set to:', addedContentHeight);

          this.chatWrapper.nativeElement.scrollTop =
            addedContentHeight + 500 * this.multiplyer;
          this.multiplyer++;
          resolve();
        } catch (err) {
          console.error(err);
          resolve();
        }
      }, 0);
    });
  }

  streamVideo(videoName: string) {
    this.videoUrl = `${environment.baseUrl}chat/stream/${videoName}`;
    // console.log('video url', this.videoUrl);
    this.showVidPopup = true;
  }

  async downloadMedia(name: string) {
    this.mediaDownloadInProgress = true
    this.contentOrFilePath = name
    this.chatService.downloadMedia(name).subscribe(
      async (blob) => {
        try {
          await this.chatService.saveFileToFilesystem(name, blob);
          this.mediaDownloadInProgress = false
          this.contentOrFilePath = ""
          this.toastr.success(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.FILE_DOWNLOAD_SUCCESS'));
        } catch (error) {
          console.error('Download failed', error);
          this.toastr.error(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.DOWNLOAD_FAILED'));
        }
      },
      (error) => {
        console.error('Download failed', error);
        this.toastr.error(this.translate.instant('COMMUNICATION_PAGE.TEAM_CHAT_PAGE.DOWNLOAD_FAILED'));
      }
    );
  }


}
