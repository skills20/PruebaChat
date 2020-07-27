import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userChat = {
    user: '',
    contact: '',
    text: ''
  }

  myMessages;
  myContacts;
  eventName = "send-message";

  constructor(private activated: ActivatedRoute, private webService: WebSocketService) { }

  ngOnInit(): void {
    const id = this.activated.snapshot.params.id;
    this.userChat.user = id;
    // para los mensajes
    this.webService.listen('text-event').subscribe((data) => {
      this.myMessages = data;
    })
    //para los contactos
    this.webService.listen('join-event').subscribe((data) => {
      this.myContacts = data;
      for (var i = 0; i < this.myContacts.length; i++) {
        if (this.myContacts[i].name === this.userChat.user) {
          console.log(this.myContacts[i]);
          this.myContacts.splice(i, 1)
        }
      }

      console.log(this.myContacts);
    })
  }

  myMessage() {
    this.webService.emit(this.eventName, this.userChat);
    this.userChat.text = '';
  }
}
