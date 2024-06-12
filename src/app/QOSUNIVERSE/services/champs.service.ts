import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class ChampsService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes type
  getChamps() {
    return this.qosUniverseService.get("champs");
  }
  getOneChamps(id) {
    return this.qosUniverseService.get("champs/" + id);
  }
  postChamps(data) {
    return this.qosUniverseService.post("champs", data);
  }

  patchChamps(id, data) {
    return this.qosUniverseService.patch("champs", id, data);
  }
  deleteChamps(id) {
    return this.qosUniverseService.delete("champs", id);
  }
}
