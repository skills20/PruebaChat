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
  myOwnMessages = [];
  myContacts;
  eventSendMsg = "send-message";
  eventSelectContact = "select-contact";
  eventChatTyping = "chat-typing";
  updateMessages = "update-Messages";
  typingChat = "";

  constructor(private activated: ActivatedRoute, private webService: WebSocketService) { }

  ngOnInit(): void {
    const id = this.activated.snapshot.params.id;
    this.userChat.user = id;
    // Cuando recibo un mensaje
    this.webService.listen('text-event').subscribe((data) => {
      this.myMessages = data;
      this.typingChat = '';
      this.myOwnMessages = [];

      this.myMessages.forEach(msg => {
        if ((msg.user === this.userChat.user && msg.contact === this.userChat.contact) || (msg.user === this.userChat.contact && msg.contact === this.userChat.user)) {
          this.myOwnMessages.push(msg);
        }
      });
    })

    //Actualizar Contactos
    this.webService.listen('update-Messages').subscribe((data) => {
      this.myMessages = data;
      this.typingChat = '';
      this.myOwnMessages = [];

      this.myMessages.forEach(msg => {
        if ((msg.user === this.userChat.user && msg.contact === this.userChat.contact) || (msg.user === this.userChat.contact && msg.contact === this.userChat.user)) {
          this.myOwnMessages.push(msg);
        }
      });
    })

    //Cuando un usuario nuevo ingresa
    this.webService.listen('join-event').subscribe((data) => {
      this.myContacts = data;
      for (var i = 0; i < this.myContacts.length; i++) {
        if (this.myContacts[i].name === this.userChat.user) {
          this.myContacts.splice(i, 1)
        }
      }
    })

    //Cuando alguien está escribiendo
    this.webService.listen('chat-typing').subscribe((data) => {
      this.typingChat = '';
      this.typingChat += data;
    })
  }

  //Cuando envío un mensaje
  myMessage() {
    this.webService.emit(this.eventSendMsg, this.userChat);
    this.userChat.text = '';
    this.typingChat = '';
  }

  //Cuando alguien estoy está escribiendo
  typing(event: any) {
    this.webService.emit(this.eventChatTyping, this.userChat.user);
  }

  //Cuando Selecciono un Contacto
  setVal(i) {
    this.userChat.contact = this.myContacts[i].name;
    this.webService.emit(this.updateMessages, this.userChat);
  }
}

