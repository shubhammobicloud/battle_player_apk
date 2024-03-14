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
  id = localStorage.getItem('userId');
  avatar = localStorage.getItem('avatar');
  username = localStorage.getItem('userName');
  teamId = localStorage.getItem('teamId');
  socket: any;
  chats: any;
  message: string = '';
  @ViewChild('teamChatTextarea') teamChatTextarea!: ElementRef;

  constructor(private http: HttpClient) {}

  @ViewChild('chatContainer', { static: true }) container:
    | ElementRef
    | undefined;

  ngAfterViewInit(): void {
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

    this.socket.emit('joinRoom', { teamId: this.teamId });

    this.socket.on('joinedRoom', (data: any) => {
      this.socket.emit('loadChat', { teamId: this.teamId });
    });

    this.socket.on('existingChat', (data: any) => {
      this.chats = data;
    });

    this.socket.on('loadNewTeamChat', (data: any) => {
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
    });
  }

  currentUser = (senderId: any): boolean => {
    const userId = localStorage.getItem('userId');
    // console.log('userId', userId, 'senderId', senderId);

    return userId !== null && userId !== undefined && senderId?._id === userId;
  };

  sendMessage() {
    if (this.message !== '') {
      const selfMessage = {
        time: new Date(),
        message: this.message,
        teamId: this.teamId,
        senderId: {
          _id: this.id,
          avatar: this.avatar,
          userName: this.username,
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
    } else {
      if (this.teamChatTextarea) {
        this.teamChatTextarea.nativeElement.style.border = '2px solid red';
      }
    }
  }

  scrollToBottom() {
    if (this.container) {
      this.container.nativeElement.scrollTop =
        this.container.nativeElement.scrollHeight;
    }
  }

  onInput() {
    this.teamChatTextarea.nativeElement.style.border = '';
  }
}
