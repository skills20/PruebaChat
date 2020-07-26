import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'pruebaChat';

  constructor(private webSocketService: WebsocketService) { }

  ngOnInit() {
    this.webSocketService.listen('test event').subscribe((data) => {
      console.log(data);
    })

  }
}
