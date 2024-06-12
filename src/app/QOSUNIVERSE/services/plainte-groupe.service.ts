import { Injectable } from "@angular/core";
import { QosUniverseService } from "src/app/shared/qos-universe-service.service";
@Injectable({
  providedIn: "root",
})
export class PlainteGroupeService {

  constructor(private qosUniverseService: QosUniverseService) { }
  
  getPlainteGroupes() {
    return this.qosUniverseService.get('plainte-groupes?filter={"include": [{"relation": "plainte"},{"relation": "statut"},{"relation": "groupe"}]}');
  }

  getActivePlainteGroupe() {
    return this.qosUniverseService.get('plainte-groupes?filter={"where":{"isActive": true},"include": [{"relation": "plainte"},{"relation": "statut"},{"relation": "groupe"}]}');
  }

  getPlainteGroupesByGroup(groupeId) {
    return this.qosUniverseService.get('plainte-groupes?filter={"where":{"groupeId":"'+groupeId+'"},"include": [{"relation": "plainte","scope": {"include": [{"relation":"origine"},{"relation":"priorite"},{"relation":"sousDomaine"},{"relation":"type"}]}},{"relation": "statut"},{"relation": "groupe"}]}');
  }
    getOnePlainteGroupe(id) {
    return this.qosUniverseService.get("plainte-groupes/" + id);
  }
  postPlainteGroupe(data) {
    return this.qosUniverseService.post("plainte-groupes", data);
  }

  patchPlainteGroupe(id, data) {
    return this.qosUniverseService.patch("plainte-groupes", id, data);
  }

  deletePlainteGroupe(id) {
    return this.qosUniverseService.delete("plainte-groupes", id);
  }
}
