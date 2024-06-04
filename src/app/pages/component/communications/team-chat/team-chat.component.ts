import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewChecked,
  ViewChild,
  AfterViewInit,OnDestroy,HostListener
} from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environment/enviroment';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.scss'],
})
export class TeamChatComponent implements OnInit, AfterViewInit,AfterViewChecked,OnDestroy {
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
  showMediaBtns:boolean = false
  selectedImage: string | ArrayBuffer | null = null;
  selectedVideo: string | ArrayBuffer | null = null;
  selectedDocument: string | ArrayBuffer | null = null;
  @ViewChild(InfiniteScrollDirective) infiniteScroll!: InfiniteScrollDirective;
  @ViewChild('teamChatTextarea') teamChatTextarea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('documentInput') documentInput!: ElementRef;
  @ViewChild('chatwrapper') chatwrapper!: ElementRef;
  messageArray:any[]=[]
  constructor(private http: HttpClient) {}

  @ViewChild('chatContainer', { static: true }) container:
    | ElementRef
    | undefined;

  ngAfterViewInit(): void {
    this.scrollToBottom()

  }
ngAfterViewChecked(): void {
  // this.scrollToBottom()

}
async ngOnDestroy() {
  // console.log('Internet is not on or connection is very slow.');
      const response =  await this.socket.timeout(5000).emitWithAck('disconnected',{teamId:this.teamId});
      // console.log(response, 'response of disconnect');
    // this.socket.disconnect();
}
 isLoadingMore = false;
 currentPage = 1;

loadChats(page: number) {
  this.isLoadingMore = true;
  // Simulate fetching data from an API (replace with real implementation)
  setTimeout(() => {
    this.currentPage++;
    this.isLoadingMore = false;
  }, 1000); // Simulate latency
}
  async ngOnInit() {
    this.scrollToBottom()

    this.socket = io(`${this.url}team-namespaces`, {

      auth: {
        serverOffset: this.id,
        teamId:this.teamId
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
              limit: 7,
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

    this.socket.on('loadNewTeamChat', (data: any, callback:any) => {
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
sum=0
throttle = 300;
scrollDistance = 1;
scrollUpDistance = 2;
onScrollDown() {

  this.sum += 20;
  // add another 20 items
  console.log("asdqwreqs")
  this.messageArray=this.chats.slice(this.sum)
}


  currentUser = (senderId: any): boolean => {
    const userId = localStorage.getItem('userId');
    // console.log('userId', userId, 'senderId', senderId);

    return userId !== null && userId !== undefined && senderId?._id === userId;
  };

  async sendMessage() {
    console.log(this.message)
    if (this.message !== '') {
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
      const data = {
        contentOrFilePath: this.message,
        senderId: this.id,
        teamId: this.teamId,
        avatar: this.avatar,
        username: this.username,
      };
      // console.log(this.socket.id,"socket id");
      // compute a unique offset
      // const clientOffset = `${this.socket.id}-${this.counter++}`;


      this.selectedImage = null;
      this.selectedVideo = null;
      this.selectedDocument = null;
      this.message = '';
      try {
        const response = await this.socket
          .timeout(5000)
          .emitWithAck('newTeamChat', data);
        // console.log(response,"response of newTeamChat"); // 'ok'
        if(response.status == 'ok'){
          console.log(response.status,"OKKK")
          this.chats.push(selfMessage);
          this.scrollToBottom()
        }
        if(response.status == 'error'){
          alert(response.message);
        }
      }catch(error:any){
        // console.log(error.message);
      }
    } else {
      if (this.teamChatTextarea) {
        this.teamChatTextarea.nativeElement.style.border = '2px solid red';
      }
    }
    // this.scrollToBottom();
  }
  @ViewChild('chatwrapper', { static: true }) chatWrapper!: ElementRef;

  scrollbarHeight!: number;
  scrollToBottom() {
    try {
      console.log('scroll to bottom called');
      this.scrollbarHeight = this.chatWrapper.nativeElement.scrollHeight;
      // console.log(this.chatWrapper.nativeElement); // Check if this logs the correct element
      this.chatWrapper.nativeElement.scrollTop =
        this.chatWrapper.nativeElement.scrollHeight;
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
      const file = input.files[0];
      console.log(`Selected ${type}:`, file);
      if (type === 'image') {
        this.readFile(file, 'image');
      } else if (type === 'video') {
        this.readFile(file, 'video');
      } else if (type ==='document'){
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


  @HostListener('scroll', ['$event'])

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

  multplier=1
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

          this.chatWrapper.nativeElement.scrollTop += addedContentHeight+500*this.multplier;
          console.log('Scroll position set to:', addedContentHeight);

          // Set the final scroll position
          this.chatWrapper.nativeElement.scrollTop = addedContentHeight +500*this.multplier;
          this.multplier++
          resolve();
        } catch (err) {
          console.error(err);
          resolve(); // Ensure the promise resolves even on error
        }
      }, 0); // Reduced timeout to ensure minimal delay
    });
  }
}
