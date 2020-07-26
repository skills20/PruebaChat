import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: any;
  readonly uri: string = "ws://localhost:3000";

  constructor() {
    this.socket = io(this.uri);
  }

  listen(eventName: String) {
    return new Observable((Subscriber) => {
      this.socket.on(eventName, (data) => {
        Subscriber.next(data);
      })
    });
  }

  emit(eventName: String, data: any) {
    this.socket.emit(eventName, data);

  }
}
