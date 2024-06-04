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
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';
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
//  videoUrl: SafeUrl | null = null;
 videoUrl:string =''
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
  // @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;


  constructor(private http: HttpClient, private chatService: ChatService, private sanitizer:DomSanitizer) {}

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
    // console.log(response, 'response of disconnect');
    // this.socket.disconnect();
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
              limit: 25,
              page: 1,
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
        // sending
        const newChat = {
          contentOrFilePath: data.message,
          time: data.time,
          senderId: {
            _id: data.id,
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
    if (this.message !== '') {
      const selfMessage = {
        time: new Date(),
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
      const data = {
        time: new Date(),
        contentOrFilePath: this.message,
        senderId: this.id,
        teamId: this.teamId,
        avatar: this.avatar,
        username: this.username,
      };
      // console.log(this.socket.id,"socket id");
      // compute a unique offset
      const clientOffset = `${this.socket.id}-${this.counter++}`;
      this.chats.push(selfMessage);
      this.selectedImage = null;
      this.selectedVideo = null;
      this.selectedDocument = null;
      this.message = '';
      this.scrollToBottom();
      try {
        const response = await this.socket
          .timeout(5000)
          .emitWithAck('newTeamChat', data, clientOffset);
        // console.log(response,"response of newTeamChat"); // 'ok'
        if (response.status == 'ok') {
        }
        if (response.status == 'error') {
          alert(response.message);
        }
      } catch (error: any) {
        // console.log(error.message);
      }
    } else {
      // if (this.teamChatTextarea) {
      //   this.teamChatTextarea.nativeElement.style.border = '2px solid red';
      // }
    }
    // this.scrollToBottom();
  }
  @ViewChild('chatwrapper', { static: true }) chatWrapper!: ElementRef;

  scrollbarHeight!: number;
  multiplyer=1;
  scrollToBottom() {
    try {
      console.log('scroll to bottom called');
      this.scrollbarHeight = this.chatWrapper.nativeElement.scrollHeight+1000*this.multiplyer;
      // console.log(this.chatWrapper.nativeElement); // Check if this logs the correct element
      this.chatWrapper.nativeElement.scrollTop =
        this.chatWrapper.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
  // scrollToBottom1() {
  //   try {
  //     // console.log("scroll height",this.chatWrapper.nativeElement.scrollHeight);
  //     // console.log("setting scroll bar",this.chatWrapper.nativeElement.scrollHeight/this.counter1);

  //     const newScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
  //     const addedContentHeight = newScrollHeight - this.previousScrollHeight;

  //     console.log("Previous scroll height:", this.previousScrollHeight);
  //   console.log("New scroll height:", newScrollHeight);
  //   console.log("Added content height:", addedContentHeight);

  //   this.chatWrapper.nativeElement.scrollTop += addedContentHeight;

  //   console.log("Scroll position set to:", this.chatWrapper.nativeElement.scrollTop);

  //   this.scrollbarHeight = this.chatWrapper.nativeElement.scrollHeight;
  //   this.chatWrapper.nativeElement.scrollTop = this.scrollbarHeight;

  //     // this.scrollbarHeight = this.chatWrapper.nativeElement.scrollHeight-this.scrollbarHeight
  //     // this.chatWrapper.nativeElement.scrollTop =
  //     //   this.chatWrapper.nativeElement.scrollHeight/this.counter1;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

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

  showImagePopup(popupImgUrl: string, type:string) {
    if(type==='local'){
    this.popupImgUrl = popupImgUrl;
    console.log('popup img url', popupImgUrl);
    this.showImgPopup = !this.showImgPopup;
  }
  else if(type==='uploaded'){
    this.popupImgUrl = `${this.url}chat/${popupImgUrl}`;
    console.log('popup img url', popupImgUrl);
    this.showImgPopup = !this.showImgPopup;
  }
  else{
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

  chatsForPush = [
    {
      _id: '66599dd85dfe2c985db0378a',
      senderId: {
        superSuperUser: false,
        _id: '665842d302198f56626128ec',
        userName: 'ASD 2',
        avatar: '1717060498275-images.png',
        email: 'asd2@gmail.com',
        password:
          '$2b$10$inaSb9RWA2DAs0pK9Jej9uQ3/FsrR.0dGNTC/Rg7DMqCWipiRKvgG',
        gameLeader: false,
        teamId: '665842d302198f56626128e4',
        companyUnit: 'Region East',
        firstLogin: true,
        targetOrSalesRepLC: 10000,
        currentSalesRepLC: 100,
        salesRepNo: 22,
        role: 'user',
        companyId: '66178631178345fda333c9cb',
        superUser: false,
        createdAt: '2024-05-30T09:11:47.164Z',
        updatedAt: '2024-06-03T07:07:54.363Z',
        __v: 0,
        favoriteNewsFeed: {
          '6658433e02198f5662612919': 'liked',
          '66584d4f2fef1f71c09ce743': 'applouds',
          '665d48f9db108dd788556667': 'rocket',
        },
      },
      teamId: '665842d302198f56626128e4',
      message: 'hi',
      clientOffset: 'voREOGYlmPuoO5ouAAHz-0',
      time: '2024-05-31T09:52:24.875Z',
      __v: 0,
    },
  ];
  counter1 = 2;
  previousScrollHeight!: number;

  // onScrollUp() {
  //   console.log("scrolled up!!");
  //   this.previousScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
  //   console.log("up height", this.previousScrollHeight);
  //   this.chatsForPush.map((obj)=>{
  //     this.chats.unshift(obj)

  //   })

  //   setTimeout(() => {
  //     this.adjustScrollPosition();
  //   }, 500);

  //   // this.scrollToBottom1();
  //   console.log(this.chats);
  //   console.log("counter", this.counter1)
  //   this.counter1++
  // }
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

  addChats(): Promise<void> {
    return new Promise((resolve) => {
      this.chatsForPush.map((obj) => {
        this.chats.unshift(obj);
      });
      resolve();
    });
  }

  // adjustScrollPosition() {
  //   try {
  //     const newScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
  //     const addedContentHeight = newScrollHeight - this.previousScrollHeight;

  //     console.log("Previous scroll height:", this.previousScrollHeight);
  //     console.log("New scroll height:", newScrollHeight);
  //     console.log("Added content height:", addedContentHeight);

  //     this.chatWrapper.nativeElement.scrollTop += addedContentHeight;

  //     console.log("Scroll position set to:", addedContentHeight);
  //     this.chatWrapper.nativeElement.scrollTop = addedContentHeight;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  adjustScrollPosition(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const newScrollHeight = this.chatWrapper.nativeElement.scrollHeight;
          const addedContentHeight =
            newScrollHeight - this.previousScrollHeight;

          console.log('Previous scroll height:', this.previousScrollHeight);
          console.log('New scroll height:', newScrollHeight);
          console.log('Added content height:', addedContentHeight);

          this.chatWrapper.nativeElement.scrollTop += addedContentHeight;
          console.log('Scroll position set to:', addedContentHeight);

          // Set the final scroll position
          this.chatWrapper.nativeElement.scrollTop = addedContentHeight;

          resolve();
        } catch (err) {
          console.error(err);
          resolve(); // Ensure the promise resolves even on error
        }
      }, 0); // Reduced timeout to ensure minimal delay
    });
  }

  // @HostListener('scroll', ['$event'])
  // onScroll(event: any) {
  //   const scrollTop = this.chatwrapper.nativeElement.scrollTop;
  //   console.log('scroll top', scrollTop);
  //   // if (scrollTop === 0 && !this.loading) {
  //   //   this.loadChats();
  //   // }
  //   if (scrollTop === 0) {
  //   this.chatsForPush.map((obj)=>{
  //     this.chats.unshift(obj)
  //   })
  // }
  // }

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
          const combinedBlob = new Blob(this.videoChunks, { type: 'video/mp4' });
          const combinedBlobUrl = URL.createObjectURL(combinedBlob);
          videoElement.src = combinedBlobUrl;
          videoElement.currentTime = videoElement.currentTime; // maintain the current playback position
        }
        this.currentChunk++;
      },
      (error) => {
        console.error('Error fetching video chunk:', error);
      
      // this.chatService.getVideoChunk('0').subscribe(blob => {
      // const videoElement = this.videoPlayer.nativeElement;
      // const url = URL.createObjectURL(blob);
      // videoElement.src = url;
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

  streamVideo(videoName:string){
this.videoUrl = `${environment.baseUrl}chat/stream/${videoName}`
console.log("video url",this.videoUrl)
this.showVidPopup = true
  }
}
