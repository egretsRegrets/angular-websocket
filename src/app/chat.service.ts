import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';

import { WebsocketService } from './websocket.service';

const CHAT_URL = 'ws://echo.websocket.org/';

export interface IMessage {
  author: string;
  message: string;
}

@Injectable()
export class ChatService {
  messages: Subject<IMessage>;

  constructor(private wsService: WebsocketService) {
    // convert the stream of MeassageEvents output by the WebsocketService to a stream of IMessage data
    this.messages = <Subject<IMessage>>wsService.connect(CHAT_URL).pipe(
      map((response: MessageEvent): IMessage => {
        const data = JSON.parse(response.data);
        return { author: data.author, message: data.message };
      })
    );
  }
}
