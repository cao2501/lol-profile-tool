import {Component, OnInit} from '@angular/core';
import {ElectronService} from "../core/services";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title = 'LEAGUE PROFILE TOOL';
  public currentVersion = 'V.2.5.0';
  public newestVersion = '';
  private _remote = new ElectronService().shell; // To open the default browser window for links instead of making a new electron window

  constructor() {
  }

  async ngOnInit() {
    try {
      let obj;
      try {
        const url = 'https://raw.githubusercontent.com/cao2501/lol-prifile-status/main/version.json';
        obj = await (await fetch(url)).json();
      } catch (e) {
        const url = 'https://raw.githubusercontent.com/cao2501/lol-prifile-status/master/version.json';
        obj = await (await fetch(url)).json();
      }
      this.newestVersion = obj && obj.version ? obj.version : this.currentVersion;
    } catch (error){
      this.newestVersion = this.currentVersion;
    }
  }

  public github() {
    this._remote.openExternal('https://github.com/cao2501/lol-prifile-status');
  }

  public youtube() {
    this._remote.openExternal('https://github.com/cao2501/lol-prifile-status');
  }
}
