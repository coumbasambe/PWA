import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class MessagerieService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes messagrie
  getMessagerie() {
    return this.qosUniverseService.get('messageries?filter={"include": [{"relation": "groupe"}]}');
  }
  getOneMessagerie(id) {
    return this.qosUniverseService.get(
      "messageries/" + id + '?filter={"include": [{"relation": "groupe"} ]}'
    );
  }
  postMessagerie(messagerie) {
    return this.qosUniverseService.post("messageries", messagerie);
  }

  patchMessagerie(id, data) {
    return this.qosUniverseService.patch("messageries", id, data);
  }
  deleteMessagerie(id) {
    return this.qosUniverseService.delete("messageries", id);
  }
}
