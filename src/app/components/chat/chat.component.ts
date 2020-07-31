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
    contactid: '',
    text: ''
  }

  myMessages = [];
  myOwnMessages = [];
  myLastMessages = [];
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
    this.webService.emit(this.updateMessages, this.userChat);

    // Cuando recibo un mensaje
    this.webService.listen('text-event').subscribe((data: []) => {
      this.myMessages = data;
      this.typingChat = '';
      this.myOwnMessages = [];
      this.myLastMessages = [];

      this.myContacts.forEach((contcs, i) => {
        this.myMessages.forEach(msgs => {
          if (msgs.contact === contcs.name || msgs.user === contcs.name) {
            this.myLastMessages[i] = msgs.text;
          };
        });
      });

      this.myMessages.forEach(msgs => {
        if ((msgs.user === this.userChat.user && msgs.contact === this.userChat.contact) ||
          (msgs.user === this.userChat.contact && msgs.contact === this.userChat.user)) {
          this.myOwnMessages.push(msgs);
        }
      });
    })

    //al seleccionar Contacto
    this.webService.listen('update-Messages').subscribe((data: []) => {
      this.myMessages = data;
      this.typingChat = '';
      this.myOwnMessages = [];
      this.myLastMessages = [];

      this.myContacts.forEach((contcs, i) => {
        this.myMessages.forEach(msgs => {
          if (msgs.contact === contcs.name || msgs.user === contcs.name) {
            this.myLastMessages[i] = msgs.text;
          };
        });
      });

      this.myMessages.forEach(msgs => {
        if ((msgs.user === this.userChat.user && msgs.contact === this.userChat.contact) ||
          (msgs.user === this.userChat.contact && msgs.contact === this.userChat.user)) {
          this.myOwnMessages.push(msgs);
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
  getContactPosition(i) {
    this.userChat.contact = this.myContacts[i].name;
    this.userChat.contactid = this.myContacts[i].id;
    this.webService.emit(this.updateMessages, this.userChat);
  }
}

