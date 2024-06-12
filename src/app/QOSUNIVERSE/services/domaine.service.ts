import { Injectable } from "@angular/core";
import { QosUniverseService } from "src/app/shared/qos-universe-service.service";
@Injectable({
  providedIn: "root",
})
export class DomaineService {
  constructor(private qosUniverseService: QosUniverseService) {}

  //Requêtes domaine
  getDomaines() {
    return this.qosUniverseService.get("domaines");
  }
  
  getOneDomaine(id) {
    return this.qosUniverseService.get("domaines/" + id);
  }
  postDomaine(domaine) {
    return this.qosUniverseService.post("domaines", domaine);
  }

  patchDomaine(id, data) {
    return this.qosUniverseService.patch("domaines", id, data);
  }
  deleteDomaine(id) {
    return this.qosUniverseService.delete("domaines", id);
  }

  // Requêtes sous-domaine
  getsousDomaine() {
    return this.qosUniverseService.get("sous-domaines");
  }
  getOneSousDomaine(id) {
    return this.qosUniverseService.get(
      // "domaines/" + id + '?filter={"include": [{"relation": "domaine"} ]}'
      "sous-domaines/" + id
    );
  }
  postSousDomaine(sousDomaine) {
    return this.qosUniverseService.post("sous-domaines", sousDomaine);
  }

  patchSousDomaine(id, data) {
    return this.qosUniverseService.patch("sous-domaines", id, data);
  }
  deleteSousDomaine(id) {
    return this.qosUniverseService.delete("sous-domaines", id);
  }
}
