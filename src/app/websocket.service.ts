import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

type MessageSubject = Subject<MessageEvent>;
@Injectable()
export class WebsocketService {
  constructor(private subject: MessageSubject) {}

  public connect(url: string, subject: MessageSubject = null): MessageSubject {
    if (subject === null) {
      subject = this.create(url);
      console.log(`successfully created: ${url}`);
    }
    return subject;
  }

  private create(url: string): MessageSubject {
    const ws = new WebSocket(url);
    const observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return Subject.create(observer, observable);
  }
}
