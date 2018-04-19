import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// we'll provide a type alias for our subject who's emissions are MessageEvents
type MessageSubject = Subject<MessageEvent>;
@Injectable()
export class WebsocketService {
  constructor() {}

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
      // use the observer-like methods native to ws as the observer methods used in this observable,
      // and bind context to the observer
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    // observer here just provides the next method of the subject (MessageSubject) to be returned
    const observer = {
      next: (data: Object) => {
        // observer checks the readyState of the websocket, which it has access to in its parent function scope
        // before stringify-ing and sending the data
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    // Subject.create makes a new subject with the observer provided,
    // in this case it makes the Subject from the pre-defined observable
    return Subject.create(observer, observable);
  }
}
