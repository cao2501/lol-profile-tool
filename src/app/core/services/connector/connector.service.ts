import { Injectable } from '@angular/core';
import { ElectronService } from "..";
import {Options} from "./options";
import {Data} from "./data";

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {
  connector: Options;
  constructor(electronService: ElectronService) {
    let clientPath = "";
    try {
      if (electronService.fs.existsSync("config\\clientPath.txt")) {
        const file = electronService.fs.readFileSync("config\\clientPath.txt").toString().trim();
        clientPath = file.split("\\").join("/");
      }
    } catch (err) {}

    // Auto-detect League of Legends path if not specified
    if (!clientPath) {
      try {
        const yamlPath = "C:/ProgramData/Riot Games/Metadata/league_of_legends.live/league_of_legends.live.product_settings.yaml";
        if (electronService.fs.existsSync(yamlPath)) {
          const yamlContent = electronService.fs.readFileSync(yamlPath, "utf8");
          const match = yamlContent.match(/product_install_full_path:\s*"(.*?)"/);
          if (match && match[1] && electronService.fs.existsSync(match[1])) {
            clientPath = match[1].split("\\").join("/");
          }
        }
      } catch (e) {}

      if (!clientPath) {
        const paths = ["D:/Riot Games/League of Legends", "C:/Riot Games/League of Legends"];
        for (const p of paths) {
          if (electronService.fs.existsSync(p)) {
            clientPath = p;
            break;
          }
        }
      }
    }

    const checkLockfile = () => {
      if (clientPath) {
        const lockfilePath = clientPath + "/lockfile";
        try {
          if (electronService.fs.existsSync(lockfilePath)) {
            const data = electronService.fs.readFileSync(lockfilePath, "utf8");
            const parts = data.split(":");
            if (parts.length >= 5) {
              this.connector = {
                rejectUnauthorized: false,
                headers: {
                  Accept: "application/json",
                  Authorization: "Basic " + btoa(`riot:${parts[3]}`)
                },
                url: `${parts[4]}://127.0.0.1:${parts[2]}`
              };
              return;
            }
          }
        } catch (e) {}
      }
      this.connector = null;
    };

    checkLockfile();
    setInterval(checkLockfile, 2000);

    const clientConnection = new electronService.LCUConnector();
    if (clientPath) {
      // @ts-ignore
      clientConnection._dirPath = clientPath;
    }
    clientConnection.on('connect', (data: Data) => {
      this.connector = {
        rejectUnauthorized: false,
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa(`${data["username"]}:${data["password"]}`)
        },
        url: `${data["protocol"]}://${data["address"]}:${data["port"]}`
      };
    });
    clientConnection.on('disconnect', () => {
      this.connector = null;
    });
    clientConnection.start();
  }
}
