import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class ChampsDomainesService {

  constructor(private qosUniverseService: qosUniverseService) { }
  //Requêtes type
  getChampsDomaines() {
    return this.qosUniverseService.get('domaine-champs?filter={"include": [{"relation": "domaine"},{"relation": "champs"}]}');
  }
  getOneChampsDomaines(id) {
    return this.qosUniverseService.get("domaine-champs/" + id);
  }
  postChampsDomaines(data) {
    return this.qosUniverseService.post("domaine-champs", data);
  }

  patchChampsDomaines(id, data) {
    return this.qosUniverseService.patch("domaine-champs", id, data);
  }

  deleteChampsDomaines(id) {
    return this.qosUniverseService.delete("domaine-champs", id);
  }
}
