import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environment/enviroment';

@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.scss'],
})
export class TeamChatComponent implements OnInit, AfterViewInit {
  url: string = `${environment.baseUrl}`;
  id = localStorage.getItem('userID');
  // teamId = '65eedf006c6e03bb7e4945ca';
  teamId = localStorage.getItem('teamID');
  socket: any;
  chats: any;
  message: string = '';
  constructor(private http: HttpClient) {}

  @ViewChild('chatContainer', { static: true }) container:
    | ElementRef
    | undefined;

  ngAfterViewInit(): void {
    // Scroll to the bottom after the view is initialized
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.socket = io(`${this.url}team-namespaces`, {
      auth: {
        _id: this.id,
        serverOffset: this.id,
      },
    });

    // Listen for the 'connect' event
    this.socket.on('connect', () => {
      console.log('Socket.IO connected successfully');
    });

    // Listen for the 'connect_error' event
    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket.IO connection error:', error.message);
    });

    // Listen for the 'connect_timeout' event
    this.socket.on('connect_timeout', (timeout: number) => {
      console.error('Socket.IO connection timeout:', timeout);
    });

    // this.loadChat();

    this.socket.emit('joinRoom', { teamId: this.teamId });

    this.socket.on('joinedRoom', (data: any) => {
      console.log(data, 'joinedRoom');

      this.socket.emit('loadChat', { teamId: this.teamId });
    });

    // this.socket.on('chat message',(data:any)=>{
    //   console.log(data,"data")
    // })

    this.socket.on('existingChat', (data: any) => {
      console.log('existingChat', data);
      this.chats = data;
    });

    this.socket.on('loadNewTeamChat', (data: any) => {
      console.log(data, 'loadNewTeamChat');
      if (data.teamId == this.teamId) {
        // let html = `<div style='text-align: start;color: black;margin: 10px;'>
        //     <h6>${data.message}</h6>
        //   </div>`;
        //   document.getElementById('chat-container')?.insertAdjacentHTML('beforebegin',html);

        const element = document.createElement('p');
        element.textContent = data.message;
        element.style.textAlign = 'start';
        element.style.color = 'black';
        // document.getElementById('group-chat-container')?.appendChild(element);

        //  adding username
        const userName = document.createElement('p');
        userName.textContent = data.userName;
        userName.style.textAlign = 'start';
        userName.style.color = 'yellow';
        // document.getElementById('group-chat-container')?.appendChild(userName);
      }

      // sending
      const newChat = {
        message: data.message,
        time: data.time,
        senderId: {
          _id: data.id,
          avatar: data.avatar,
          userName: data.userName,
        },
      };
      this.chats.push(newChat);
      this.socket.auth.serverOffset = data.id;

      // this.chatsArray.push(this.globalData);
    });
  }

  // loadChat = () => {
  //   console.log('Load chats');
  //   const data = { senderId: this.id, teamId: this.teamId };

  //   this.http.post(`${this.url}load-chat`, data).subscribe(
  //     (res: any) => {
  //       console.log('res', res);
  //       this.chats = res.data;
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // };

  currentUser = (senderId: any): boolean => {
    const userId = localStorage.getItem('userID');
    // console.log('userId', userId, 'senderId', senderId);

    return userId !== null && userId !== undefined && senderId?._id === userId;
  };

  // sendMessage() {
  //   console.log('message', this.message);
  //   let userId = localStorage.getItem('userID');
  //   let data = {
  //     senderId: userId,
  //     teamId: this.teamId,
  //     message: this.message,
  //     time: new Date(),
  //   };
  //   this.http.post(`${this.url}save-team-chat`, data).subscribe(
  //     (res: any) => {
  //       console.log('res', res);
  //       this.message = '';
  //       // this.loadChat();
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }

  sendMessage() {
    // const message = this.teamChat.nativeElement.value;
    // console.log("sd",this.chatTop.nativeElement)
    if (this.message !== '') {
      const selfMessage = {
        time: new Date(),
        message: this.message,
        teamId: this.teamId,
        senderId: {
          _id: this.id,
        },
      };
      const data = {
        time: new Date(),
        message: this.message,
        senderId: this.id,
        teamId: this.teamId,
      };
      this.socket.emit('newTeamChat', data);
      this.chats.push(selfMessage);
      this.message = '';
    }
  }

  // imgURL(senderId: any) {

  //   console.log("img url ",this.url + senderId.avatar)
  //   console.log("img url ",senderId)
  //   return this.url + senderId.avatar;
  // }

  scrollToBottom() {
    if (this.container) {
      this.container.nativeElement.scrollTop =
        this.container.nativeElement.scrollHeight;
    }
  }
}
