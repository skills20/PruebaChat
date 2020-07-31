import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  User = {
    name: ''
  }

  myContacts;
  eventJoin = "join-contact";
  alert: boolean = false;

  constructor(private activated: ActivatedRoute,
    private webService: WebSocketService) { }

  ngOnInit(): void {
    const id = this.activated.snapshot.params.id;
    this.User.name = id;

    this.webService.listen('join-event').subscribe((data) => {
      this.myContacts = data;
    })
  }

  myContact() {
    this.webService.emit(this.eventJoin, this.User);
  }

  closeAlert() {
    this.alert = false;
  }
}
