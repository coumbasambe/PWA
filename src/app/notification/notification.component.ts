import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../network.service';

@Component({
  selector: 'app-notification',
  template: `
    <div *ngIf="!isOnline" class="notification offline">Vous êtes hors ligne.</div>
    <div *ngIf="isOnline && wasOffline" class="notification online">Connexion rétablie.</div>
  `,
  styles: [`
    .notification {
      position: fixed;
      bottom: 10px;
      left: 10px;
      padding: 10px;
      color: white;
      border-radius: 5px;
      z-index: 1000;
    }
    .offline {
      background-color: red;
    }
    .online {
      background-color: green;
    }
  `]
})
export class NotificationComponent implements OnInit {
  isOnline: boolean = true;
  wasOffline: boolean = false;

  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    this.networkService.connectionStatus.subscribe(status => {
      if (!status) {
        this.wasOffline = true;
      }
      this.isOnline = status;
    });
  }
}
