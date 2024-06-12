import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes agent
  getMessages() {
    return this.qosUniverseService.get('/messages?filter={"order":["date DESC"],"include": [{"relation": "agent"},{"relation": "plainte"} ]}');
  }
  getOneMessage(id) {
    return this.qosUniverseService.get(
      "messages/" + id + '?filter={"include": [{"relation": "agent"},{"relation": "plainte"} ]}'
    );
  }
  postMessage(message) {
    return this.qosUniverseService.post("/messages", message);
  }

  patchMessage(id, data) {
    return this.qosUniverseService.patch("messages", id, data);
  }
  deleteMessage(id) {
    return this.qosUniverseService.delete("/messages", id);
  }

}
