import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class DomaineService {
  constructor(private qosUniverseService: qosUniverseService) {}

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
    return this.qosUniverseService.get('sous-domaines?filter={"include": [{"relation": "domaine"}]}');
  }
  getOneSousDomaine(id) {
    return this.qosUniverseService.get("sous-domaines/" + id);
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
