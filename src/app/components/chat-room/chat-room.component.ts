import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { webSocket } from "rxjs/webSocket";
import { WebSocketService } from 'src/app/services/webSocket/web-socket.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  username = '';
  room = '';
  roomData: any;
  messages: any[] = [];
  inputMessage = '';

  constructor(
    private webSocketService: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.params.username;
    this.room = this.route.snapshot.params.room;

    this.webSocketService.emit('join', { username: this.username, room: this.room }, (error: any) => {
      if (error) {
        alert(error);
        location.href = '/';
      }
    });

    this.webSocketService.listen('message').subscribe((data: any) => {
      this.messages.push(data);
      console.log(data);
    });

    this.webSocketService.listen('locationMessage').subscribe((data: any) => {
      data['isLocation'] = true;
      this.messages.push(data);
      console.log(data);
    });

    this.webSocketService.listen('roomData').subscribe((data: any) => {
      this.roomData = data;
      console.log('roomData', data);
    });
  }

  sendMessage() {
    if (this.inputMessage) {
      this.webSocketService.emit('sendMessage', this.inputMessage, (error: any) => {
        if (error) {
          return console.log(error);
        }
        this.inputMessage = '';
        console.log('Message delivered!');
      });
    }
  }

  sendLocation() {
    if (!navigator.geolocation) {
      return alert('Geolocation not suppported')
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.webSocketService.emit('sendLocation', this.inputMessage, (error: any) => {
        if (error) {
          return console.log(error);
        }
        console.log('Location shared!');
      });
    });
  }
}
