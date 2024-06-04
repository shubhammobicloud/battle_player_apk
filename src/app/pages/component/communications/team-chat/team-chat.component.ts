import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewChecked,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Socket, io } from 'socket.io-client';
import { ChatService } from 'src/app/services/chat/chat.service';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.scss'],
})
export class TeamChatComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
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
  //  videoUrl: SafeUrl | null = null;
  videoUrl: string = '';
  private videoChunks: Blob[] = [];
  private currentChunk: number = 0;

  showImgPopup: boolean = false;
  showVidPopup: boolean = false;
  popupImgUrl: string = '';
  popupVidUrl: string = '';

  @ViewChild('teamChatTextarea') teamChatTextarea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('documentInput') documentInput!: ElementRef;
  @ViewChild('chatwrapper') chatwrapper!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    private http: HttpClient,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) {}

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
          alert(response.message);
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
            console.log('chats', this.chats);
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
        console.log("data", data)
        
        const newChat = {
          contentOrFilePath: data.contentOrFilePath,
          createdAt: data.createdAt,
          fileType:data.fileType,
          teamId:data.teamId,
          senderId: {
            _id: data._id,
            avatar: data.avatar,
            userName: data.userName,
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

  currentUser = (senderId: any): boolean => {
    const userId = localStorage.getItem('userId');
    // console.log('userId', userId, 'senderId', senderId);

    return userId !== null && userId !== undefined && senderId?._id === userId;
  };

  async sendMessage() {
    console.log("callinggggggggggggggggggggggggggggggggggggggggg")
    // if (this.message !== '') {
    const selfMessage = {
      contentOrFilePath: this.message,
      teamId: this.teamId,
      senderId: {
        _id: this.id,
        avatar: this.avatar,
        userName: this.username,
      },
      imageUrl: this.selectedImage ? this.selectedImage : null,
      videoUrl: this.selectedVideo ? this.selectedVideo : null,
      documentName: this.selectedDocument ? this.selectedDocument : null,
    };

    console.log("self message",selfMessage)

    if (this.message == '') {
      this.selectedImage = null
          this.selectedVideo = null
      this.chatService
        .uploadMedia(this.selectedMedia)
        .subscribe((res: any) => {
          console.log('img upload');
          // this.chats.push(selfMessage);
          
        });
    } else {
      const data = {
        contentOrFilePath: this.message,
        senderId: this.id,
        teamId: this.teamId,
        avatar: this.avatar,
        username: this.username,
      };
      // console.log(this.socket.id,"socket id");
      // compute a unique offset
      this.chats.push(selfMessage);
      this.selectedImage = null;
      this.selectedVideo = null;
      this.selectedDocument = null;
      this.message = '';
      this.chats.push(selfMessage)
        this.scrollToBottom();

      try {
        const response = await this.socket
          .timeout(5000)
          .emitWithAck('newTeamChat', data);
        // console.log(response,"response of newTeamChat"); // 'ok'
        if (response.status == 'ok') {


        }
        if (response.status == 'error') {
          alert(response.message);
        }
      } catch (error: any) {
        // console.log(error.message);
      }
    }
    // } else {
    //   // if (this.teamChatTextarea) {
    //   //   this.teamChatTextarea.nativeElement.style.border = '2px solid red';
    //   // }
    //   // const selfMessage = {
    //   //   time: new Date(),
    //   //   contentOrFilePath: this.message,
    //   //   teamId: this.teamId,
    //   //   senderId: {
    //   //     _id: this.id,
    //   //     avatar: this.avatar,
    //   //     userName: this.username,
    //   //   },
    //   //   imageUrl: this.selectedImage ? this.selectedImage : null,
    //   //   videoUrl: this.selectedVideo ? this.selectedVideo : null,
    //   //   documentName: this.selectedDocument ? this.selectedDocument : null,
    //   // };
    //   this.chatService
    //     .uploadMedia('image', this.selectedMediaImage)
    //     .subscribe((res:any) => {
    //     //   {
    //     //     "_id": "665ed4a03d002139ae31a865",
    //     //     "senderId": {
    //     //         "userName": "test",
    //     //         "avatar": "1716533612034-football.jpg",
    //     //         "_id": "665039330ca713f4d3e69d54"
    //     //     },
    //     //     "teamId": "665039330ca713f4d3e69d51",
    //     //     "contentOrFilePath": "wq",
    //     //     "fileType": "text",
    //     //     "createdAt": "2024-06-04T08:47:28.811Z"
    //     // }
    //       const selfMessage = {
    //         createdAt: new Date(),
    //         teamId: this.teamId,
    //         senderId: {
    //           _id: this.id,
    //           avatar: this.avatar,
    //           userName: this.username,
    //         },
    //         contentOrFilePath: res.data,
    //         fileType: "image",
    //       };
    //       this.chats.push(selfMessage);
    //       this.selectedImage = null;

    //       console.log('res', res);
    //     });
    // }
    // this.scrollToBottom();
  }
  @ViewChild('chatwrapper', { static: true }) chatWrapper!: ElementRef;

  scrollbarHeight!: number;

  scrollToBottom() {
    try {
      console.log('scroll to bottom called');

      // Wait for the DOM to update (consider using MutationObserver for more complex scenarios)
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
  onFileSelected(event: Event, type: string) {
    this.showMediaBtns = false;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMedia = input.files[0];
      const file = input.files[0];
      console.log(`Selected ${type}:`, file);
      if (type === 'image') {
        this.readFile(file, 'image');
      } else if (type === 'video') {
        this.readFile(file, 'video');
      } else if (type === 'document') {
        this.readFile(file, 'document');
      }
    }
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
      console.log('popup img url', popupImgUrl);
      this.showImgPopup = !this.showImgPopup;
    } else if (type === 'uploaded') {
      this.popupImgUrl = `${this.url}chat/${popupImgUrl}`;
      console.log('popup img url', popupImgUrl);
      this.showImgPopup = !this.showImgPopup;
    } else {
      this.showImgPopup = !this.showImgPopup;
    }
  }

  showVideoPopup(popupVidUrl: string) {
    this.popupVidUrl = popupVidUrl;
    console.log('popup img url', popupVidUrl);
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
    console.log('scrolled up!!');
    this.previousScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
    console.log('up height', this.previousScrollHeight);

    await this.addChats().then(() => {
      this.adjustScrollPosition().then(() => {
        // Trigger additional scroll behavior if needed
        // this.checkAndScrollUpAgain();
      });
    });

    console.log(this.chats);
    console.log('counter', this.counter1);
    this.counter1++;
  }

  page=1
  addChats(): Promise<void> {
    return new Promise( async (resolve) => {
      this.page++
      const response = await this.socket
            .timeout(5000)
            .emitWithAck('loadChat', {
              teamId: this.teamId,
              limit: 7,
              page: this.page,
            });
          if (response.status == 'error') {
           console.log(response.message);
          }
          if (response.status == 'ok') {
            // const chats = response.existingChat;
          this.chats = [...response.orderedChat,...this.chats];
          console.log('chats', this.chats);
          }

      resolve();
    });
  }
  multiplyer=1;
  adjustScrollPosition(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const newScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
          const addedContentHeight = newScrollHeight - this.previousScrollHeight;

          console.log('Previous scroll height:', this.previousScrollHeight);
          console.log('New scroll height:', newScrollHeight);
          console.log('Added content height:', addedContentHeight);
          console.log('Scroll position set to:', addedContentHeight);

          // Set the final scroll position
          this.chatWrapper.nativeElement.scrollTop = addedContentHeight +500 * this.multiplyer;
          this.multiplyer++
          resolve();
        } catch (err) {
          console.error(err);
          resolve(); // Ensure the promise resolves even on error
        }
      }, 0); // Reduced timeout to ensure minimal delay
    });
  }

  loadInitialChunk() {
    this.chatService.getVideoChunk().subscribe(
      (blob) => {
        this.videoChunks.push(blob);
        const videoBlobUrl = URL.createObjectURL(blob);
        // this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoBlobUrl);
        const videoElement = this.videoPlayer.nativeElement;
        if (this.currentChunk === 0) {
          videoElement.src = videoBlobUrl;
          videoElement.play();
        } else {
          // Append new chunk to the existing video
          const combinedBlob = new Blob(this.videoChunks, {
            type: 'video/mp4',
          });
          const combinedBlobUrl = URL.createObjectURL(combinedBlob);
          videoElement.src = combinedBlobUrl;
          videoElement.currentTime = videoElement.currentTime; // maintain the current playback position
        }
        this.currentChunk++;
      },
      (error) => {
        console.error('Error fetching video chunk:', error);
    });
  }

  // onSeeking(event: Event) {
  //   const videoElement = this.videoPlayer.nativeElement;
  //   const currentTime = videoElement.currentTime;
  //   const range = `bytes=${Math.floor(currentTime * 1000000)}-9999999`;

  //   this.chatService.getVideoChunk(range).subscribe((blob) => {
  //     const url = URL.createObjectURL(blob);
  //     videoElement.src = url;
  //     videoElement.currentTime = currentTime;
  //     videoElement.play();
  //   });
  // }

  streamVideo(videoName: string) {
    this.videoUrl = `${environment.baseUrl}chat/stream/${videoName}`;
    console.log('video url', this.videoUrl);
    this.showVidPopup = true;
  }
}
