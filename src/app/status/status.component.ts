import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../core/dialog/dialog.component";
import {LCUConnectionService} from "../core/services/lcuconnection/lcuconnection.service";

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  public text = '';

  constructor(public dialog: MatDialog, private lcuConnectionService: LCUConnectionService) {
  }

  private send(body: Record<string, unknown>, successMsg: string) {
    this.lcuConnectionService.requestSend(body, 'PUT', 'lolChat').then(response => {
      this.dialog.open(DialogComponent, {
        data: {body: response || successMsg}
      });
    }).catch(err => {
      this.dialog.open(DialogComponent, {
        data: {body: 'Error: ' + (err && err.message ? err.message : JSON.stringify(err))}
      });
    });
  }

  public setStatus() {
    this.send({ statusMessage: this.text, availability: 'chat' }, 'Online status & message updated successfully!');
  }

  public setMobile() {
    this.send({ statusMessage: this.text, availability: 'mobile' }, 'Mobile status updated successfully!');
  }

  public setAway() {
    this.send({ statusMessage: this.text, availability: 'away' }, 'Away status updated successfully!');
  }

  public setOffline() {
    this.send({ statusMessage: this.text, availability: 'offline' }, 'Offline status updated successfully!');
  }

  public clearStatus() {
    this.text = '';
    this.send({ statusMessage: '', availability: 'chat' }, 'Status cleared successfully!');
  }
}
