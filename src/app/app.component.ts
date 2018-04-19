import { Component, OnInit } from '@angular/core';

import { WebsocketService } from './websocket.service';
import { ChatService, IMessage } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ChatService, WebsocketService]
})
export class AppComponent implements OnInit {
  message: IMessage = {
    author: 'dev',
    message: ''
  };

  clientMessage = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.messages.subscribe((msg: IMessage) => console.log(`response from websocket: ${msg.message}`));
  }

  public sendMessage() {
    console.log(`new message from client to websocket`);
    this.message.message = this.clientMessage;
    // introduce message into messages stream
    this.chatService.messages.next(this.message);
    // wipe local message content
    this.message.message = '';
  }
}
