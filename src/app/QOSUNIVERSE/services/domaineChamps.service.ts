import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class DomaineChampsService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes type
  getDomaineChamps() {
    return this.qosUniverseService.get('domaine-champs?filter={"include": [{"relation": "champs"},{"relation": "domaine"} ]}');
  }
  getOneDomaineChamps(id) {
    return this.qosUniverseService.get("domaine-champs/" + id);
  }
  postDomaineChamps(data) {
    return this.qosUniverseService.post("domaine-champs", data);
  }
  getDomaineChampsByDomaine(domaineId){
    return this.qosUniverseService.get('domaine-champs?filter={"where": {"domaineId": "'+domaineId+'"},"include": [{"relation": "champs"}]}');
  }

  patchDomaineChamps(id, data) {
    return this.qosUniverseService.patch("domaine-champs", id, data);
  }
  deleteDomaineChamps(id) {
    return this.qosUniverseService.delete("domaine-champs", id);
  }
}
